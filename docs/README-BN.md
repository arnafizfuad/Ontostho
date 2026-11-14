# Antastha Studio — Logo Update

এই প্যাকেজে তোমার দেওয়া logo concept sheet-এর primary mark অনুযায়ী পরিষ্কার SVG mark যুক্ত করা হয়েছে। Header-এ mark-এর পাশে বাংলা wordmark আছে।

## Upload
ZIP extract করে ভেতরের সব ফাইল GitHub repository `arnafizfuad.github.io`-এর root-এ upload করো। আগের `CNAME` ফাইলটি রেখো। `main` branch-এ commit করো।

## Logo note
`assets/logo.svg` হলো reference image দেখে তৈরি vector redraw; concept sheet-এর raster crop নয়। Original editable vector/AI/SVG থাকলে সেটি দিয়ে stroke geometry আরও নির্ভুলভাবে প্রতিস্থাপন করা যাবে।

## SEO
SEO metadata, canonical URL, Open Graph, JSON-LD, robots.txt এবং sitemap.xml অন্তর্ভুক্ত। Google Search Console-এ sitemap submit করো।

## Analytics
GA4 চালু করতে `assets/config.js`-এ Measurement ID বসাও। বাস্তব Search Console ও GA4 report admin-এ দেখাতে secure backend/API এবং admin authentication দরকার। GitHub Pages একা secure multi-user admin দেয় না।


## নতুন Art Direction: Quiet Energy
Homepage ও Photography section নতুন করে সাজানো হয়েছে—cinematic hero, asymmetrical visual journal, expressive project composition, restrained parallax ও hover motion। CSS-এ images.unsplash.com-এর demo photography URL ব্যবহার করা হয়েছে। প্রকাশের আগে এগুলো অন্তস্থের নিজস্ব অনুমোদিত project/photo assets দিয়ে replace করুন।

## Products page

নতুন `/products/` পেজে furniture, lighting, objects এবং spatial elements-এর concept showcase যোগ করা হয়েছে। এখানে ব্যবহৃত ছবিগুলো demo/placeholder imagery; এগুলো প্রকৃত Antastha পণ্যের ছবি, specification, মূল্য বা availability নির্দেশ করে না। প্রকাশের আগে নিজস্ব অনুমোদিত product photography ও নিশ্চিত তথ্য দিয়ে প্রতিস্থাপন করুন।


## নতুন Feature Layer (প্রোটোটাইপ)
- সব পেজে contextual `[OPEN]` / `[EXPLORE]` hover label এবং Photography image viewer।
- Photography-তে প্রতিবার নতুন shuffled discovery order, scroll reveal এবং conventional grid-এ ফেরার control।
- Light/Dark/System appearance preference এবং English/Bangla language switch।
- Homepage ambient wind-like soundscape; পেজ ছাড়ার সময় fade-out এবং user sound control।
- Homepage scroll position অনুযায়ী Works / Photography / Studio route URL reflection।
- Admin-এ default language-এর local preview preference।

## গুরুত্বপূর্ণ সীমাবদ্ধতা
এই সাইটটি GitHub Pages-এ static hosting হিসেবে তৈরি। তাই Admin-এর local preference শুধু যে browser-এ সেট করা হবে সেখানেই থাকবে; সব visitor-এর জন্য প্রকাশিত default language বা multilingual content database-এ সংরক্ষণ করতে secure backend/CMS লাগবে। AI Creative Assistant-এর জন্য authenticated server-side API, provider key management এবং image upload processing দরকার। বর্তমান ZIP-এ AI chatbot-কে কার্যকর বলে দেখানো হয়নি এবং এটি auto-publish করে না। Photography-র ambient sound Web Audio দিয়ে তৈরি একটি হালকা synthesized ambience, প্রাকৃতিক field recording নয়; browser autoplay policy অনুযায়ী প্রথম interaction লাগতে পারে।

## Supabase CMS ও নিরাপদ Admin (নতুন)
- `/admin/` এখন Supabase Auth login, admin allowlist, content editor, draft/publish control, image upload এবং site settings UI ব্যবহার করে।
- `supabase-schema.sql` Supabase SQL Editor-এ একবার Run করতে হবে।
- `SUPABASE-SETUP-BN.md`-এ প্রথম Admin account, team invite এবং deployment-এর ধাপ আছে।
- `assets/config.js`-এ Project URL ও Publishable Key রাখা আছে; Secret/service_role key কখনো এখানে রাখবে না।
- Public content pages-এ database content render করার integration এবং AI Creative Assistant পরবর্তী ধাপ; এই প্যাকেজে সেগুলো সম্পূর্ণ হয়েছে বলে দাবি করা হচ্ছে না।


### ছবি শেয়ার ও SEO
- Photography viewer-এ `[SHARE]` control যোগ হয়েছে; supported mobile browser-এ native share sheet খুলবে, অন্য ক্ষেত্রে page link copy হবে।
- সাধারণ right-click save ও drag action নিরুৎসাহিত করা হয়েছে এবং ওয়েবসাইটে দেখা বা scroll করার সময় কোনো watermark দেখানো হয় না। Viewer-এর `[DOWNLOAD + WATERMARK]` control দিয়ে download করলে কপিতে watermark বসে। এটি শতভাগ download protection নয়; screenshot বা browser cache দিয়ে কপি করা সম্ভব।
- Admin editor-এ image alt text, SEO title ও SEO description যোগ হয়েছে। Title/description থেকে এগুলো প্রাথমিকভাবে auto-fill হয়; publish করার আগে যাচাই/সম্পাদনা করো।
- ছবির বিষয়বস্তু বিশ্লেষণ করে AI-generated SEO লিখতে আলাদা secure server-side AI integration এখনো প্রয়োজন।
