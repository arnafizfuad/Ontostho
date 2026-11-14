# Antastha Studio — Supabase CMS setup

এই সংস্করণে `/admin/` পেজে Supabase Auth login, allowlist-based admin access, content CRUD, publish/draft control, image upload এবং site settings যুক্ত হয়েছে। GitHub Pages static hosting আগের মতোই থাকবে।

## ১. Database তৈরি
1. Supabase Dashboard → SQL Editor → New query খুলুন।
2. ZIP-এর `supabase-schema.sql` সম্পূর্ণ কপি করে Run করুন।
3. সফল হলে `content_items`, `site_settings`, `admin_users` টেবিল এবং `antastha-media` public image bucket তৈরি হবে।

## ২. প্রথম Admin account
1. Supabase → Authentication → Providers-এ Email provider চালু আছে নিশ্চিত করুন।
2. Authentication → Users থেকে নিজের ইমেইলে Invite user দিন। Invite গ্রহণ করে password সেট করুন।
3. Users তালিকা থেকে নিজের User UID কপি করুন।
4. SQL Editor-এ নিচের query-তে নিজের UID বসিয়ে আলাদাভাবে Run করুন:

```sql
insert into public.admin_users(user_id)
values ('YOUR-AUTH-USER-UUID');
```

5. ওয়েবসাইটের `/admin/` খুলে সেই email/password দিয়ে sign in করুন।

## ৩. Team member যোগ
প্রতিটি সদস্যকে Authentication → Users থেকে invite করুন। তারপর তার UID `admin_users` টেবিলে যোগ করুন:

```sql
insert into public.admin_users(user_id)
values ('TEAM-MEMBER-USER-UUID');
```

অ্যাক্সেস বাতিল করতে:

```sql
delete from public.admin_users
where user_id = 'TEAM-MEMBER-USER-UUID';
```

## ৪. GitHub Pages-এ আপডেট
ZIP extract করে সব ফাইল repository root-এ আপলোড/replace করুন; `CNAME` ফাইলটি অক্ষত রাখুন। Commit করার পর Pages deploy শেষ হলে `/admin/` খুলুন।

## নিরাপত্তা
- `assets/config.js`-এ শুধু Project URL ও Publishable Key রাখা হয়েছে। Publishable key browser-এ থাকা স্বাভাবিক; এটি একা admin permission দেয় না।
- Supabase Secret key, legacy `service_role` key, database password কখনো HTML/JS/ZIP বা GitHub repository-তে রাখবেন না।
- RLS policy ছাড়া কোনো public write access তৈরি করা হয়নি। Admin allowlist ছাড়া login করলেও content management করা যাবে না।
- এই ZIP-এর publishable key আগে চ্যাটে পাঠানো হয়েছিল। এটি public key হলেও Supabase Dashboard থেকে নতুন Publishable Key তৈরি করে `assets/config.js`-এ পুরোনোটি বদলে নেওয়া ভালো।

## বর্তমান সীমা
- Admin থেকে content তৈরি/সম্পাদনা, draft/publish এবং ছবি upload করা যাবে।
- এই প্রথম সংস্করণে public Works/Photography/Products/Videos পেজগুলো এখনো database-এর content দিয়ে স্বয়ংক্রিয়ভাবে render করে না; public CMS display integration পরের ধাপ।
- Site settings database-এ সংরক্ষিত হয়, কিন্তু সব page-এর title/logo/language-এ প্রয়োগ করার public settings layer এখনো যুক্ত হয়নি।
- AI Creative Assistant ইচ্ছাকৃতভাবে এখনো সক্রিয় নয়। এর জন্য আলাদা Edge Function/server-side API, secret management, rate limiting এবং upload-processing flow তৈরি করতে হবে।
- Invite flow-তে Supabase Auth-এর email confirmation/SMTP configuration প্রয়োজন হতে পারে।
