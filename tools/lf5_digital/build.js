// Baut materials/digital/LF5_M_<n>.html aus sheets/M<n>.js + engine.* + template.html
const fs=require('fs'),path=require('path');
const out=path.join(__dirname,'..','..','materials','digital');fs.mkdirSync(out,{recursive:true});
const rd=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
const tpl=rd('template.html'),css=rd('engine.css'),js=rd('engine.js');
const nums=process.argv.slice(2).length?process.argv.slice(2):[1,2,3,4,5,6,7,8,9,10,11];
for(const n of nums){
  const data=require('./sheets/M'+n+'.js');
  const html=tpl.replace('@@TITLE@@',()=>data.title).replace('@@CSS@@',()=>css)
    .replace('@@DATA@@',()=>JSON.stringify(data).replace(/<\//g,'<\\/')).replace('@@JS@@',()=>js);
  fs.writeFileSync(path.join(out,'LF5_M_'+n+'.html'),html);
  console.log('gebaut',n,Math.round(html.length/1024)+' KB');
}
