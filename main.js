const languages = {
"English":"en","French":"fr","Spanish":"es","German":"de","Italian":"it","Portuguese":"pt",
"Dutch":"nl","Russian":"ru","Chinese (Simplified)":"zh-cn","Chinese (Traditional)":"zh-tw",
"Japanese":"ja","Korean":"ko","Arabic":"ar","Hindi":"hi","Telugu":"te","Tamil":"ta",
"Kannada":"kn","Malayalam":"ml","Gujarati":"gu","Bengali":"bn","Marathi":"mr",
"Punjabi":"pa","Urdu":"ur","Assamese":"as","Odia":"or","Konkani":"kok","Kashmiri":"ks",
"Sindhi":"sd","Nepali":"ne","Tibetan":"bo","Manipuri":"ma","Turkish":"tr","Vietnamese":"vi",
"Polish":"pl","Swedish":"sv","Hungarian":"hu"
}

function fillLangs(){
  const sel1=document.getElementById("imageLang")
  const sel2=document.getElementById("textLang")
  for(const k in languages){
    let op=document.createElement("option")
    op.value=languages[k]
    op.innerText=k
    sel1.appendChild(op.cloneNode(true))
    sel2.appendChild(op.cloneNode(true))
  }
}
fillLangs()

// ------------------  OCR Code ------------------
const imageInput=document.getElementById("imageInput")
const previewArea=document.getElementById("previewArea")
const previewImage=document.getElementById("previewImage")
const ocrBtn=document.getElementById("ocrTranslateBtn")
const spinner=document.getElementById("spinner")
const statusText=document.getElementById("statusText")
const extractedBox=document.getElementById("extractedBox")
const translatedBox=document.getElementById("translatedBox")
const copyExtract=document.getElementById("copyExtract")
const copyTranslate=document.getElementById("copyTranslate")
const themeToggle=document.getElementById("themeToggle")

imageInput.addEventListener("change",function(){
  const f=this.files[0]
  if(!f) return
  const reader=new FileReader()
  reader.onload=function(e){
    previewImage.src=e.target.result
    previewArea.classList.remove("hidden")
  }
  reader.readAsDataURL(f)
})

function showSpinner(show,msg){
  if(show){spinner.classList.remove("hidden"); statusText.innerText=msg||"Processing..."}
  else {spinner.classList.add("hidden"); statusText.innerText=msg||"Ready"}
}

ocrBtn.addEventListener("click",async function(){
  const file=imageInput.files[0]
  if(!file){alert("Please choose an image first"); return}
  const lang=document.getElementById("imageLang").value
  const fd=new FormData()
  fd.append("image",file)
  fd.append("lang",lang)
  showSpinner(true,"Extracting text...")
  extractedBox.innerText=""
  translatedBox.innerText=""
  try{
    const res=await fetch("/translate_image", {method:"POST", body:fd})
    const data=await res.json()
    showSpinner(false,"Done")
    extractedBox.innerText=data.extracted_text||""
    translatedBox.innerText=data.translated_text||""
  }catch(e){
    showSpinner(false,"Error")
    extractedBox.innerText="Error: "+e.message
  }
})

copyExtract.addEventListener("click",()=>navigator.clipboard.writeText(extractedBox.innerText))
copyTranslate.addEventListener("click",()=>navigator.clipboard.writeText(translatedBox.innerText))

themeToggle.addEventListener("click",()=>{
  document.documentElement.classList.toggle("light")
  themeToggle.innerText=document.documentElement.classList.contains("light")?"🌞":"🌙"
})

// ------------------ NEW TEXT TRANSLATION ------------------
document.getElementById("textTranslateBtn").addEventListener("click", async ()=>{
  const text = document.getElementById("textInput").value.trim()
  const lang = document.getElementById("textLang").value
  if(!text){ alert("Enter text first."); return }

  showSpinner(true,"Translating text...")

  const res = await fetch("/translate_text", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ text, lang })
  })

  const data = await res.json()
  showSpinner(false,"Done")

  document.getElementById("textTranslatedBox").innerText = data.translated
})


