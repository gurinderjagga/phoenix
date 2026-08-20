/**
 * fix_layout_interactive.js
 * Repaginates the document. This version uses an array of text snippets.
 * If any element's text exactly contains one of these snippets, we force a page break immediately BEFORE it.
 */
const puppeteer = require('puppeteer-core');
const fs = require('fs');

const FILE = 'e:/Phoenix/report/Phoenix_Project_Report.html';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// ADD ANY STRINGS HERE THAT SHOULD FORCE A PAGE BREAK
const FORCE_BREAK_BEFORE = [
  '1.2 Problem Statement',
  '1.3 OBJECTIVES',
  'The primary objectives of the Phoenix project are as follows:',
  '1.4 Scope of the Project',
  '2.3 Technologies Reviewed',
  '2.4.2 Technical Feasibility',
  '2.5.4 JSON Web Tokens (JWT)',
  '3.3 Functional Requirements',
  '1. Presentation Tier (Client): Built with React.js',
  '4.3 Data Flow Diagram (DFD)',
  'Key Relationships:',
  '4.7 SDLC Model Used',
  '4.8.3 Transaction Processing Workflow (Reservation Engine)',
  '4.10 Comprehensive Data Dictionary',
  'Data Entity: CARS (Inventory Matrix)',
  '5.4 User Interface Screenshots',
  '6.5 Detailed Testing Traceability Matrix',
  '6.6 User Acceptance Testing (UAT)',
  '7.2 Future Scope',
  '5.3 Core Backend Modules',
  '5.2 Core Frontend Modules',
  '6.3 System Security Measures'
];

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--allow-file-access-from-files', '--disable-web-security']
  });

  const tab = await browser.newPage();
  await tab.setViewport({ width: 794, height: 1122, deviceScaleFactor: 1 });
  await tab.goto('file:///' + FILE.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });

  const result = await tab.evaluate((forceBreakStrings) => {
    const allPages = Array.from(document.querySelectorAll('.page'));
    const contentNodes = [];
    let titlePageNode = null;

    for (const pg of allPages) {
      if (pg.classList.contains('title-page')) {
         titlePageNode = pg;
         continue;
      }
      for (const ch of Array.from(pg.children)) {
         const cls = ch.className || '';
         if (cls.includes('page-header') || cls.includes('page-num')) continue;
         if (ch.tagName === 'BR') continue;
         contentNodes.push(ch.cloneNode(true));
      }
    }

    document.body.innerHTML = '';
    const body = document.body;
    const MAX_CONTENT_BOTTOM = 1010;

    function createNewPage() {
      const pg = document.createElement('div');
      pg.className = 'page';
      pg.innerHTML = `<div class="page-header">Phoenix – A Car Commerce Web Application | Project Report</div>`;
      body.appendChild(pg);
      return pg;
    }

    if (titlePageNode) body.appendChild(titlePageNode);

    let currentPage = createNewPage();
    const isHeading = (n) => ['H1','H2','H3'].includes(n.tagName) || (n.className||'').includes('title');

    for (let i = 0; i < contentNodes.length; i++) {
       const node = contentNodes[i];
       
       let forcePageBreak = false;
       
       // Major chapters always break
       if (node.tagName === 'H1' && node.className.includes('chapter-title')) {
           forcePageBreak = true;
       }

       // Manual user requests across any element
       const nodeText = node.textContent.trim();
       if (!node.className.includes('toc-row')) {
           for (const trigger of forceBreakStrings) {
               if (nodeText.includes(trigger) || (trigger.toLowerCase() === nodeText.toLowerCase())) {
                   forcePageBreak = true;
                   break;
               }
           }
       }
       
       // Only break if we aren't already at the top of a fresh page
       if (forcePageBreak) {
           const siblings = Array.from(currentPage.children);
           const isAlmostFirst = siblings.filter(c => !c.className.includes('page-header') && !c.className.includes('page-num')).length > 1;
           if (!isAlmostFirst) forcePageBreak = false; // already at top
       }

       if (forcePageBreak) {
           currentPage = createNewPage();
       }
       
       currentPage.appendChild(node);

       let r = node.getBoundingClientRect();
       let pr = currentPage.getBoundingClientRect();
       let relBottom = r.bottom - pr.top;

       let needsNewPage = (relBottom > MAX_CONTENT_BOTTOM);

       // Heading sticky logic
       if (!needsNewPage && isHeading(node)) {
           let nextNode = i + 1 < contentNodes.length ? contentNodes[i + 1] : null;
           if (nextNode && !isHeading(nextNode)) {
               currentPage.appendChild(nextNode);
               const nextR = nextNode.getBoundingClientRect();
               const nextRelBottom = nextR.bottom - pr.top;
               if (nextRelBottom > MAX_CONTENT_BOTTOM) needsNewPage = true;
               currentPage.removeChild(nextNode);
           }
       }

       if (needsNewPage) {
           currentPage.removeChild(node);
           currentPage = createNewPage();
           currentPage.appendChild(node);
       }
    }

    // Numbers & tables
    const ROMAN = ['i','ii','iii','iv','v','vi','vii','viii','ix','x','xi','xii','xiii','xiv','xv','xvi','xvii','xviii','xix','xx'];
    let ri = 0, ai = 0, arabicStarted = false;

    for (const pg of document.querySelectorAll('.page')) {
      if (pg.classList.contains('title-page')) continue;
      
      const numDiv = document.createElement('div');
      numDiv.className = 'page-num';
      pg.appendChild(numDiv);

      for (const h of pg.querySelectorAll('h1.chapter-title')) {
        const txt = h.textContent.trim();
        if (!arabicStarted && txt.startsWith('Chapter 1')) {
          arabicStarted = true;
        }
      }
      numDiv.textContent = arabicStarted ? String(++ai) : (ROMAN[ri++] || 'r'+ri);
    }
    
    // Maps
    const figureMap = {};
    const tableMap  = {};
    for (const pg of document.querySelectorAll('.page')) {
      const numEl = pg.querySelector('.page-num');
      if (!numEl) continue;
      const pageNum = numEl.textContent.trim();
      const caps = pg.querySelectorAll('.diagram-caption');
      for (const cap of caps) {
        const txt = cap.textContent.trim();
        const f = txt.match(/^(Figure\s+\d+\.\d+)/i);
        const t = txt.match(/^(Table\s+\d+\.\d+)/i);
        if (f) figureMap[f[1]] = pageNum;
        if (t) tableMap[t[1]] = pageNum;
      }
      const h3s = pg.querySelectorAll('h3.sub-section');
      for (const h of h3s) {
        const tMatch = h.textContent.trim().match(/^(Table\s+\d+\.\d+)/i);
        if (tMatch) tableMap[tMatch[1]] = pageNum;
      }
    }

    const setTableRefs = (titleText, map) => {
       const titleEl = Array.from(document.querySelectorAll('h1.chapter-title')).find(h => h.textContent.trim() === titleText);
       if (!titleEl) return;
       const rows = titleEl.closest('.page').querySelectorAll('tr');
       for (const row of rows) {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 3) {
             const keyRaw = cells[0].textContent.trim();
             const hit = Object.keys(map).find(k => k === keyRaw || keyRaw.startsWith(k));
             if (hit) cells[2].textContent = map[hit];
          }
       }
    };
    setTableRefs('List of Figures', figureMap);
    setTableRefs('List of Tables', tableMap);

    // Synchronize Table of Contents page numbers dynamically
    const headingMap = {};
    for (const pg of document.querySelectorAll('.page')) {
      const numEl = pg.querySelector('.page-num');
      if (!numEl) continue;
      const pageNum = numEl.textContent.trim();
      
      const headings = pg.querySelectorAll('h1.chapter-title, h2.section-title, h3.sub-section');
      for (const h of headings) {
        let txt = h.textContent.trim();
        headingMap[txt] = pageNum;
      }
    }

    const tocRows = document.querySelectorAll('.toc-row');
    for (const row of tocRows) {
       const spans = row.querySelectorAll('span');
       if (spans.length >= 2) {
           const titleTxt = spans[0].textContent.trim();
           if (headingMap[titleTxt]) {
               spans[1].textContent = headingMap[titleTxt];
           }
       }
    }

    return document.documentElement.outerHTML;
  }, FORCE_BREAK_BEFORE);

  await browser.close();
  fs.writeFileSync(FILE, '<!DOCTYPE html>\n' + result, 'utf8');
}

main().catch(console.error);
