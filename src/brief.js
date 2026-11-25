(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.AssemblyBrief=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  function buildText(s,dishes){
    const chosen=dishes.filter(d=>s.dishes.includes(d.id)).map(d=>d.name);
    return ['ASSEMBLY / ILLUSTRATIVE EVENT BRIEF','A fictional PerPixel concept. This is not a booking or quotation.','',`Occasion: ${s.occasion || 'Not selected'}`,`Guests: ${s.guests}`,`Dining experience: ${s.dining || 'Not selected'}`,`Creative direction: ${s.direction || 'Not selected'}`,`Additional services: ${s.extras.length ? s.extras.join(', ') : 'None selected'}`,`Preferred date: ${s.date || 'Not specified'}`,`City: ${s.city || 'Not specified'}`,`Venue notes: ${s.venue || 'Not specified'}`,`Culinary service: ${s.service}`,`Illustrative menu: ${chosen.length ? chosen.join(', ') : 'No dishes selected'}`,'','This brief stays in your browser. No enquiry has been sent.'].join('\n');
  }
  function makePdf(lines){
    const ascii=x=>x.normalize('NFKD').replace(/[^\x20-\x7E]/g,'?').replace(/[\\()]/g,'\\$&');
    const wrapped=[];
    for(const line of lines.split('\n')){
      if(!line){wrapped.push('');continue;}
      let rest=line;
      while(rest.length>82){let at=rest.lastIndexOf(' ',82);if(at<20)at=82;wrapped.push(rest.slice(0,at));rest=rest.slice(at).trimStart();}
      wrapped.push(rest);
    }
    const blocks=[];
    for(let i=0;i<wrapped.length;i+=43)blocks.push(wrapped.slice(i,i+43));
    const objects=[''];
    const add=x=>(objects.push(x),objects.length-1);
    const catalog=add(''),pages=add(''),font=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'),ids=[];
    for(const block of blocks){
      const stream='BT /F1 11 Tf 16 TL 48 760 Td '+block.map((line,i)=>`${i?'T* ':''}(${ascii(line)}) Tj`).join(' ')+' ET';
      const content=add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
      ids.push(add(`<< /Type /Page /Parent ${pages} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${font} 0 R >> >> /Contents ${content} 0 R >>`));
    }
    objects[catalog]=`<< /Type /Catalog /Pages ${pages} 0 R >>`;
    objects[pages]=`<< /Type /Pages /Kids [${ids.map(x=>`${x} 0 R`).join(' ')}] /Count ${ids.length} >>`;
    let pdf='%PDF-1.4\n';const offsets=[0];
    for(let i=1;i<objects.length;i++){offsets[i]=pdf.length;pdf+=`${i} 0 obj\n${objects[i]}\nendobj\n`;}
    const start=pdf.length;pdf+=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;
    for(let i=1;i<objects.length;i++)pdf+=`${String(offsets[i]).padStart(10,'0')} 00000 n \n`;
    pdf+=`trailer\n<< /Size ${objects.length} /Root ${catalog} 0 R >>\nstartxref\n${start}\n%%EOF`;
    return new Blob([pdf],{type:'application/pdf'});
  }
  return {buildText,makePdf};
});
