(() => {
  const cfg = window.ANTASTHA_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const loginPanel = $('loginPanel'), dashboard = $('dashboardPanel');
  let supabase, currentUser, items = [];
  const message = (value, where = 'appMessage') => { $(where).textContent = value || ''; };
  const escapeHtml = (value='') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const slugify = value => value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  function showDashboard(user){ currentUser=user; loginPanel.hidden=true; dashboard.hidden=false; $('signedInAs').textContent=`SIGNED IN · ${user.email}`; loadItems(); loadSettings(); }
  function showLogin(){ dashboard.hidden=true; loginPanel.hidden=false; }
  async function init(){
    if(!window.supabase || !cfg.supabaseUrl || !cfg.supabasePublishableKey){ message('Supabase configuration is missing. Check assets/config.js.','loginMessage'); return; }
    supabase = window.supabase.createClient(cfg.supabaseUrl,cfg.supabasePublishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    const {data:{session}} = await supabase.auth.getSession();
    if(session) await verifyAdmin(session.user); else showLogin();
    supabase.auth.onAuthStateChange((_event,session)=>{ if(session) setTimeout(()=>verifyAdmin(session.user),0); else showLogin(); });
  }
  async function verifyAdmin(user){
    const {data,error}=await supabase.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle();
    if(error || !data){ await supabase.auth.signOut(); showLogin(); message(error ? `Access check failed: ${error.message}` : 'This account is not on the admin allowlist. Ask the project owner to grant access.','loginMessage'); return; }
    showDashboard(user);
  }
  $('loginForm').addEventListener('submit',async e=>{e.preventDefault();message('Signing in…','loginMessage');const {data,error}=await supabase.auth.signInWithPassword({email:$('loginEmail').value.trim(),password:$('loginPassword').value});if(error){message(error.message,'loginMessage');return;}await verifyAdmin(data.user);});
  $('signOutBtn').addEventListener('click',async()=>{await supabase.auth.signOut();showLogin();message('Signed out.');});
  async function loadItems(){
    message(''); $('contentList').innerHTML='<p class="muted">Loading…</p>';
    const {data,error}=await supabase.from('content_items').select('*').order('sort_order',{ascending:true}).order('updated_at',{ascending:false});
    if(error){$('contentList').innerHTML='';message(`Could not load content: ${error.message}`);return;} items=data||[]; renderItems();
  }
  function renderItems(){
    const type=$('filterType').value, visibility=$('filterVisibility').value;
    const list=items.filter(x=>(type==='all'||x.type===type)&&(visibility==='all'||(visibility==='published'?x.is_published:!x.is_published)));
    $('contentList').innerHTML=list.length?list.map(x=>`<article class="content-row"><div><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.type)} · /${escapeHtml(x.slug)}</p></div><span class="status-pill ${x.is_published?'live':''}">${x.is_published?'PUBLISHED':'DRAFT / HIDDEN'}</span><button class="admin-button" data-edit="${x.id}">EDIT ↗</button></article>`).join(''):'<p class="muted">No content in this filter yet.</p>';
    $('contentList').querySelectorAll('[data-edit]').forEach(btn=>btn.addEventListener('click',()=>editItem(btn.dataset.edit)));
  }
  $('filterType').addEventListener('change',renderItems);$('filterVisibility').addEventListener('change',renderItems);
  function resetEditor(){ $('itemForm').reset();$('itemId').value='';$('itemSort').value='0';$('editorTitle').textContent='New item';$('deleteItemBtn').hidden=true;$('uploadStatus').textContent='';['itemSeoTitle','itemSeoDescription','itemAlt'].forEach(id=>delete $(id).dataset.edited); }
  function openEditor(){ $('itemForm').hidden=false; $('itemForm').scrollIntoView({behavior:'smooth',block:'start'}); }
  $('newItemBtn').addEventListener('click',()=>{resetEditor();openEditor();});$('closeEditor').addEventListener('click',()=>{$('itemForm').hidden=true;});
  function editItem(id){const x=items.find(i=>i.id===id);if(!x)return;['itemSeoTitle','itemSeoDescription','itemAlt'].forEach(id=>delete $(id).dataset.edited); $('itemId').value=x.id;$('itemType').value=x.type;$('itemTitle').value=x.title||'';$('itemTitleBn').value=x.title_bn||'';$('itemSlug').value=x.slug||'';$('itemDescription').value=x.description||'';$('itemDescriptionBn').value=x.description_bn||'';$('itemImage').value=x.image_url||'';$('itemAlt').value=x.image_alt||'';$('itemSeoTitle').value=x.seo_title||'';$('itemSeoDescription').value=x.seo_description||'';$('itemLink').value=x.external_url||'';$('itemSort').value=x.sort_order??0;$('itemPublished').checked=!!x.is_published;$('editorTitle').textContent='Edit item';$('deleteItemBtn').hidden=false;openEditor();}
  function autoSeo(){
    const title=$('itemTitle').value.trim(), desc=$('itemDescription').value.trim();
    if(!$('itemSeoTitle').dataset.edited || !$('itemSeoTitle').value.trim()) $('itemSeoTitle').value=title ? `${title} | Antastha Studio` : '';
    if(!$('itemSeoDescription').dataset.edited || !$('itemSeoDescription').value.trim()) $('itemSeoDescription').value=(desc || `${title} — Architecture, interiors and spatial narratives by Antastha Studio.`).slice(0,300);
    if(!$('itemAlt').dataset.edited || !$('itemAlt').value.trim()) $('itemAlt').value=title ? `${title} — Antastha Studio` : '';
  }
  $('itemTitle').addEventListener('input',()=>{if(!$('itemId').value)$('itemSlug').value=slugify($('itemTitle').value);autoSeo();});
  $('itemDescription').addEventListener('input',autoSeo);
  ['itemSeoTitle','itemSeoDescription','itemAlt'].forEach(id=>$(id).addEventListener('input',()=>$(id).dataset.edited='1'));
  $('itemFile').addEventListener('change',async()=>{const file=$('itemFile').files[0];if(!file)return;if(!file.type.startsWith('image/')){message('Please choose an image file.');return;}if(file.size>12*1024*1024){message('Image must be smaller than 12 MB.');return;}const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');const path=`${currentUser.id}/${crypto.randomUUID()}.${ext}`;$('uploadStatus').textContent='Uploading…';const {error}=await supabase.storage.from('antastha-media').upload(path,file,{upsert:false,contentType:file.type});if(error){$('uploadStatus').textContent=error.message;return;}const {data}=supabase.storage.from('antastha-media').getPublicUrl(path);$('itemImage').value=data.publicUrl;autoSeo();$('uploadStatus').textContent='Uploaded. SEO fields filled from title and description; review before saving.';});
  $('itemForm').addEventListener('submit',async e=>{e.preventDefault();message('Saving…');const id=$('itemId').value;const payload={type:$('itemType').value,title:$('itemTitle').value.trim(),title_bn:$('itemTitleBn').value.trim()||null,slug:slugify($('itemSlug').value.trim()),description:$('itemDescription').value.trim()||null,description_bn:$('itemDescriptionBn').value.trim()||null,image_url:$('itemImage').value.trim()||null,image_alt:$('itemAlt').value.trim()||null,seo_title:$('itemSeoTitle').value.trim()||$('itemTitle').value.trim(),seo_description:$('itemSeoDescription').value.trim()||$('itemDescription').value.trim()||null,external_url:$('itemLink').value.trim()||null,sort_order:Number($('itemSort').value)||0,is_published:$('itemPublished').checked,updated_at:new Date().toISOString()};if(!payload.title||!payload.slug){message('Title and slug are required.');return;}const result=id?await supabase.from('content_items').update(payload).eq('id',id):await supabase.from('content_items').insert({...payload,created_by:currentUser.id});if(result.error){message(`Save failed: ${result.error.message}`);return;}message('Item saved.');$('itemForm').hidden=true;await loadItems();});
  $('deleteItemBtn').addEventListener('click',async()=>{const id=$('itemId').value;if(!id||!confirm('Permanently delete this item?'))return;const {error}=await supabase.from('content_items').delete().eq('id',id);if(error){message(`Delete failed: ${error.message}`);return;}$('itemForm').hidden=true;message('Item deleted.');await loadItems();});
  async function loadSettings(){const {data,error}=await supabase.from('site_settings').select('key,value');if(error){message(`Settings unavailable: ${error.message}`);return;}const s=Object.fromEntries((data||[]).map(x=>[x.key,x.value]));$('settingName').value=s.site_name||'Antastha Studio';$('settingNameBn').value=s.site_name_bn||'অন্তস্থ';$('settingLanguage').value=s.default_language||'en';}
  $('settingsForm').addEventListener('submit',async e=>{e.preventDefault();message('Saving settings…');const rows=[['site_name',$('settingName').value.trim()],['site_name_bn',$('settingNameBn').value.trim()],['default_language',$('settingLanguage').value]].map(([key,value])=>({key,value,updated_at:new Date().toISOString(),updated_by:currentUser.id}));const {error}=await supabase.from('site_settings').upsert(rows,{onConflict:'key'});message(error?`Settings save failed: ${error.message}`:'Settings saved. Public pages need the CMS display layer to consume these values.');});
  document.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b===btn));['content','settings','team'].forEach(t=>$(t+'Tab').hidden=t!==btn.dataset.tab);}));
  init().catch(err=>{showLogin();message(err.message,'loginMessage');});
})();
