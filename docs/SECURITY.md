# Security notes

- The browser bundle contains only the Supabase project URL and publishable key. Publishable keys are designed for public clients; they are not authorization credentials.
- Never commit Supabase secret keys, service_role keys, database passwords, SMTP credentials, or AI provider keys.
- All CMS tables have Row Level Security enabled. Public users can read only published content and site settings. Writes require an authenticated user explicitly listed in `public.admin_users`.
- Admin access is checked both by the UI and by database RLS. The UI check is not the security boundary; RLS is.
- The media bucket is publicly readable for website display; only allowlisted admins can upload, update, or delete.
- Review RLS policies before adding tables or new endpoints. Keep privileged AI/API operations server-side (Supabase Edge Functions or another backend).


## Image protection and sharing
The frontend disables casual right-click saving and drag-to-desktop on protected gallery images and offers a Share action. This is deterrence only: any image delivered to a browser can still be saved through screenshots, caches, developer tools, or network inspection. Use visible/embedded watermarks and publish appropriately sized derivatives if stronger deterrence is desired. Do not upload confidential or licensed originals.


## Image watermark behavior
The public image viewer does not overlay a watermark. The explicit download control attempts to create a separate JPEG copy with an Antastha Studio watermark. This is a deterrent, not DRM; screenshots and browser/network tools can still capture displayed images. Cross-origin images must permit CORS for canvas export to work.
