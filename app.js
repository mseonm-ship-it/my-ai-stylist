const $ = id => document.getElementById(id);
const key = "my-ai-stylist-wardrobe-v1";

let wardrobe = JSON.parse(localStorage.getItem(key) || "[]");

const cool = new Set(["blue","navy","black","white","gray","burgundy"]);
const warm = new Set(["beige","brown","khaki","olive","orange","yellow","red"]);

function save(){ localStorage.setItem(key, JSON.stringify(wardrobe)); renderWardrobe(); }

function emoji(color){
  return {blue:"💙",navy:"🔵",black:"🖤",white:"🤍",gray:"🩶",beige:"🤎",brown:"🤎",khaki:"🫒",olive:"🫒",red:"❤️",orange:"🧡",yellow:"💛",burgundy:"🍷"}[color] || "🎨";
}
function colorName(color){
  return {blue:"파란색",navy:"네이비",black:"검정",white:"화이트",gray:"회색",beige:"베이지",brown:"브라운",khaki:"카키",olive:"올리브",red:"레드",orange:"오렌지",yellow:"옐로우",burgundy:"버건디"}[color] || color;
}
function renderWardrobe(){
  const box=$("wardrobe");
  if(!wardrobe.length){box.innerHTML='<p class="muted">아직 등록된 옷이 없습니다.</p>';return}
  box.innerHTML=wardrobe.map((x,i)=>`
    <div class="item">
      <button class="x" onclick="removeItem(${i})">×</button>
      <strong>${emoji(x.color)} ${x.name}</strong>
      <small>${x.category} · ${colorName(x.color)} · ${x.fit}</small>
    </div>`).join("");
}
window.removeItem=i=>{wardrobe.splice(i,1);save()};

$("wardrobeForm").addEventListener("submit",e=>{
  e.preventDefault();
  wardrobe.push({
    name:$("name").value.trim(),
    category:$("category").value,
    color:$("color").value,
    fit:$("fit").value
  });
  e.target.reset(); save();
});

$("clearBtn").onclick=()=>{if(confirm("옷장을 모두 삭제할까요?")){wardrobe=[];save();$("looks").className="looks empty";$("looks").textContent="옷장을 등록하고 추천 버튼을 눌러보세요."}};

$("demoBtn").onclick=()=>{
  wardrobe=[
    {name:"파란색 반팔티",category:"상의",color:"blue",fit:"regular"},
    {name:"블랙 팬츠",category:"하의",color:"black",fit:"regular"},
    {name:"카키 팬츠",category:"하의",color:"khaki",fit:"regular"},
    {name:"네이비 셔츠",category:"상의",color:"navy",fit:"regular"},
    {name:"화이트 티셔츠",category:"상의",color:"white",fit:"regular"},
    {name:"검정 운동화",category:"신발",color:"black",fit:"regular"},
    {name:"검정 모자",category:"모자",color:"black",fit:"regular"},
    {name:"선글라스",category:"액세서리",color:"black",fit:"regular"}
  ];
  save();
};

function pick(cat, colors=[]){
  return wardrobe.find(x=>x.category===cat && (!colors.length || colors.includes(x.color))) ||
         wardrobe.find(x=>x.category===cat);
}

function compatibility(item,tone){
  if(!item) return 0;
  if(tone==="cool") return cool.has(item.color)?95:(warm.has(item.color)?72:82);
  if(tone==="warm") return warm.has(item.color)?95:(cool.has(item.color)?72:82);
  return 85;
}

$("recommendBtn").onclick=()=>{
  const tone=$("tone").value;
  const top=pick("상의", tone==="cool"?["blue","navy","white","gray","black"]:tone==="warm"?["beige","brown","olive","khaki","white"]:[]);
  const blackBottom=pick("하의",["black","navy","gray"]);
  const khakiBottom=pick("하의",["khaki","olive","beige"]);
  const shoes=pick("신발",["black","white","gray"]);
  const cap=pick("모자",["black","navy","gray"]);
  const glasses=pick("액세서리",["black","gray"]);

  const looks=[
    {title:"LOOK 1 · 깔끔한 기본", badge:"컬러 밸런스", items:[top,blackBottom,shoes,cap], why:"쿨톤 계열 상의와 블랙을 연결해 색상 대비를 또렷하게 만들고, 신발까지 검정으로 이어 실루엣이 깔끔하게 정리됩니다."},
    {title:"LOOK 2 · 트렌디 캐주얼", badge:"쿨톤 포인트", items:[top,khakiBottom,shoes,glasses], why:"상의의 차가운 색감에 카키를 하의로 배치해 너무 단조롭지 않게 만들었습니다. 얼굴 주변은 쿨톤 상의가 담당합니다."},
    {title:"LOOK 3 · 레트로 스포츠", badge:"올드스쿨 무드", items:[pick("상의",["white","navy","blue"]),blackBottom,shoes,cap], why:"화이트·네이비·블랙의 강한 대비를 활용해 90s 스포츠웨어 느낌을 현대적으로 정리했습니다."}
  ];
  $("looks").className="looks";
  $("looks").innerHTML=looks.map((l,idx)=>{
    const valid=l.items.filter(Boolean);
    const score=Math.round(valid.reduce((s,x)=>s+compatibility(x,tone),0)/valid.length);
    return `<article class="look">
      <span class="badge">${l.badge}</span><h3>${l.title}</h3>
      <div class="score">${score}%</div>
      <div class="muted">현재 컬러 프로필 기준 어울림</div>
      <ul>${valid.map(x=>`<li>${emoji(x.color)} ${x.name} <small>(${x.category})</small></li>`).join("")}</ul>
      <p class="why">${l.why}</p>
    </article>`;
  }).join("");
};

$("tone").addEventListener("change",()=>{
  const tone=$("tone").value;
  if(tone==="cool") $("season").value="summer";
  if(tone==="warm") $("season").value="spring";
});

renderWardrobe();
