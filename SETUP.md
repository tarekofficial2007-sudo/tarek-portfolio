# TAREK portfolio + admin panel: setup guide

Public site: `/`   Admin login: `/admin`   Dashboard: `/admin/dashboard`

## One-time Firebase setup
1. Go to https://console.firebase.google.com > Add project (name it e.g. tarek-chef). Google Analytics can be off.
2. Build > Authentication > Get started > Sign-in method > enable **Email/Password**.
   Then Settings > User actions > turn OFF **Enable create (sign-up)** so nobody else can register.
3. Authentication > Users > Add user. Email: `tarekofficial2007@gmail.com`, password: your initial password.
   Copy the **User UID** shown in the list.
4. Build > Firestore Database > Create database (production mode). Open the **Rules** tab, paste the contents of
   `firestore.rules`, replace `PASTE_ADMIN_UID_HERE` with your UID, press **Publish**.
5. Project settings (gear) > Your apps > Web (</>) > register app > copy the config values into `public/js/firebase-config.js`.
6. Deploy: install Node.js, then in this folder run `npm install -g firebase-tools`, `firebase login`, `firebase init` (choose the existing project, keep the existing files), then `firebase deploy`.

## Change the password (do this right away)
The initial password was shared in a chat, so replace it with a long, unique one.
Firebase Console > Authentication > Users > the 3-dots menu > **Reset password** (an email is sent to you).

## Security notes
- No password is stored in any file. Firebase checks it on its servers.
- The values in `firebase-config.js` are public identifiers by design. Security comes from `firestore.rules` and `storage.rules`, which allow only your UID to write.
- The dashboard page itself is a public file, but it shows and saves nothing unless Firebase confirms you are the admin.
- Not built yet: photo, gallery, CV and logo uploads (next stage, uses `storage.rules`).
