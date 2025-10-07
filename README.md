# EliteReply Partner Application System

This system allows potential partners to submit applications to join the EliteReply network. The application includes business information, applicant details, and optional logo upload, with automatic email notifications sent to the EliteReply team.

## Features

- ✅ Responsive partner application form
- ✅ Firebase integration for data storage
- ✅ File upload for business logos
- ✅ Automatic email notifications with styled HTML templates
- ✅ Form validation and error handling
- ✅ Loading states and success/error messages

## Setup Instructions

### 1. Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable the following services:
   - **Firestore Database**
   - **Storage**
   - **Functions**

### 2. Firebase Configuration

1. In your Firebase project, go to Project Settings
2. In the "General" tab, scroll down to "Your apps"
3. Click "Add app" and select the web icon (</>)
4. Register your app and copy the Firebase configuration object
5. Replace the placeholder configuration in `firebaseConfig.js`:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-actual-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### 3. Component Architecture

The project now uses a modular component system:

- **Header & Footer Components**: Located in the `components/` folder
- **Component Loader**: Automatically loads header and footer into all pages
- **Centralized Firebase Config**: Single configuration file for all Firebase operations

**Benefits:**
- ✅ DRY (Don't Repeat Yourself) - Header and footer defined once
- ✅ Easy maintenance - Update navigation in one place
- ✅ Consistent styling across all pages
- ✅ Centralized Firebase configuration
- ✅ Better organization and structure

### 3. Email Configuration

1. Open `functions/index.js`
2. Configure the nodemailer transporter with your email credentials:

```javascript
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your preferred email service
  auth: {
    user: 'your-actual-email@gmail.com', // Replace with your email
    pass: 'your-actual-app-password' // Replace with your app password
  }
});
```

**For Gmail:**
- Enable 2-factor authentication on your Google account
- Generate an App Password: Google Account > Security > 2-Step Verification > App passwords
- Use the generated password in the configuration

### 4. Deploy Firebase Functions

1. Install Firebase CLI globally:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```
- Select Functions, Firestore, Storage, and Hosting
- Choose your existing project
- Accept default settings

4. Install function dependencies:
```bash
cd functions
npm install
cd ..
```

5. Deploy the functions:
```bash
firebase deploy --only functions
```

6. Update the Cloud Function URL in `applicationForm.html`:
```javascript
await fetch('https://your-region-your-project.cloudfunctions.net/sendPartnerApplicationEmail', {
```

### 5. Deploy the Website (Optional)

Deploy to Firebase Hosting:
```bash
firebase deploy --only hosting
```

## File Structure

```
EliteReply_web/
├── index.html                   # Home page
├── clients.html                 # Clients page
├── partenaires.html            # Partners page (updated with application button)
├── tarifs.html                 # Pricing page
├── conditions.html             # Terms of service page
├── politique.html              # Privacy policy page
├── applicationForm.html        # Partner application form
├── firebaseConfig.js           # Firebase configuration (centralized)
├── firebase.json               # Firebase project configuration
├── firestore.rules            # Firestore security rules
├── firestore.indexes.json     # Firestore indexes
├── storage.rules              # Storage security rules
├── components/                 # Reusable components
│   ├── header.html            # Header navigation component
│   ├── footer.html            # Footer component
│   └── componentLoader.js     # JavaScript to load components
├── functions/
│   ├── package.json           # Node.js dependencies
│   └── index.js               # Cloud Function for email sending
└── assets/
    ├── logo.png               # EliteReply logo
    └── vector/                # Vector images
        ├── image1.png
        ├── image2.png
        ├── image3.png
        ├── image4.png
        └── image5.png
```

## How It Works

1. **User fills out the form** on `applicationForm.html`
2. **Firebase uploads** the business logo to Storage (if provided)
3. **Application data is saved** to Firestore database
4. **Cloud Function triggers** and sends two emails:
   - Professional notification to `jeremytopaka@gmail.com` with application details
   - Confirmation email to the applicant
5. **Success message** is shown to the user

## Email Templates

The system sends two beautifully designed HTML emails:

### 1. Admin Notification Email
- Professional design with company branding
- Complete application details in organized sections
- Business logo display (if uploaded)
- Quick action buttons for responding
- Mobile-responsive design

### 2. Applicant Confirmation Email
- Confirmation of successful submission
- Next steps information
- Professional branding
- Contact information for questions

## Security Considerations

- Update Firestore and Storage rules for production use
- Add proper authentication and validation
- Implement rate limiting for form submissions
- Add CAPTCHA protection if needed
- Validate file uploads (size, type, content)

## Customization

- Modify the email templates in `functions/index.js`
- Update styling in `applicationForm.html`
- Add additional form fields as needed
- Customize Firebase security rules
- Add analytics tracking

## Support

For questions or issues, contact: jeremytopaka@gmail.com
