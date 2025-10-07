const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure your SMTP transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your preferred email service
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-app-password' // Replace with your app password
  }
});

exports.sendPartnerApplicationEmail = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { applicationId, applicationData } = req.body;
    
    // Generate HTML email content
    const emailHtml = generateApplicationEmailHtml(applicationData);
    
    // Also save to Firestore for backup/tracking
    const db = admin.firestore();
    await db.collection('applications').doc(applicationId).set({
      ...applicationData,
      emailSent: true,
      emailSentAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Send email to EliteReply team
    const mailOptions = {
      from: 'noreply@elitereply.com',
      to: 'jeremytopaka@gmail.com',
      subject: `Nouvelle Candidature de Partenariat - ${applicationData.businessInfo.name}`,
      html: emailHtml
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation email to applicant
    const confirmationMailOptions = {
      from: 'noreply@elitereply.com',
      to: applicationData.applicantInfo.email,
      subject: 'Confirmation de Candidature - EliteReply',
      html: generateConfirmationEmailHtml(applicationData)
    };

    await transporter.sendMail(confirmationMailOptions);

    res.status(200).json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

function generateApplicationEmailHtml(applicationData) {
  const { businessInfo, applicantInfo, submissionDate } = applicationData;
  
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouvelle Candidature de Partenariat</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px;
          background-color: #f7f9fc;
        }
        .header { 
          background: linear-gradient(135deg, #2196F3, #4CAF50); 
          color: white; 
          padding: 30px; 
          text-align: center; 
          border-radius: 12px 12px 0 0;
          margin-bottom: 0;
        }
        .content { 
          background: white; 
          padding: 30px; 
          border-radius: 0 0 12px 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .section { 
          margin-bottom: 30px; 
          padding: 20px; 
          background: #f8f9fa; 
          border-radius: 8px;
          border-left: 4px solid #2196F3;
        }
        .section h3 { 
          color: #2196F3; 
          margin-top: 0; 
          font-size: 1.4em;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 10px;
        }
        .info-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 15px; 
          margin-top: 15px;
        }
        .info-item { 
          background: white; 
          padding: 15px; 
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }
        .info-label { 
          font-weight: bold; 
          color: #495057; 
          margin-bottom: 5px;
          font-size: 0.9em;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .info-value { 
          color: #333; 
          font-size: 1.1em;
        }
        .logo-section {
          text-align: center;
          margin: 20px 0;
        }
        .logo-section img {
          max-width: 150px;
          max-height: 150px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .highlight { 
          background: #e3f2fd; 
          padding: 15px; 
          border-radius: 6px; 
          border-left: 4px solid #2196F3;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          color: #666;
        }
        .action-buttons {
          text-align: center;
          margin: 25px 0;
        }
        .btn {
          display: inline-block;
          padding: 12px 25px;
          margin: 0 10px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .btn-approve {
          background: #4CAF50;
          color: white;
        }
        .btn-review {
          background: #2196F3;
          color: white;
        }
        @media (max-width: 600px) {
          .info-grid { grid-template-columns: 1fr; }
          body { padding: 10px; }
          .header { padding: 20px; }
          .content { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🤝 Nouvelle Candidature de Partenariat</h1>
        <p style="margin: 0; opacity: 0.9;">Une nouvelle entreprise souhaite rejoindre le réseau EliteReply</p>
      </div>
      
      <div class="content">
        <div class="highlight">
          <strong>📅 Date de soumission:</strong> ${new Date(submissionDate).toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>

        <div class="section">
          <h3>🏢 Informations sur l'Entreprise</h3>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Nom de l'entreprise</div>
              <div class="info-value">${businessInfo.name}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Catégorie</div>
              <div class="info-value">${businessInfo.category}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Adresse</div>
              <div class="info-value">${businessInfo.address}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Ville</div>
              <div class="info-value">${businessInfo.city}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Pays</div>
              <div class="info-value">${businessInfo.country}</div>
            </div>
          </div>
          
          <div class="info-item" style="margin-top: 15px;">
            <div class="info-label">Description de l'entreprise</div>
            <div class="info-value" style="white-space: pre-wrap; line-height: 1.5;">${businessInfo.description}</div>
          </div>
          
          ${businessInfo.website ? `
            <div class="info-item" style="margin-top: 15px;">
              <div class="info-label">Site web</div>
              <div class="info-value">
                <a href="${businessInfo.website}" target="_blank" style="color: #2196F3; text-decoration: none;">
                  ${businessInfo.website}
                </a>
              </div>
            </div>
          ` : ''}
          
          ${businessInfo.logoUrl ? `
            <div class="logo-section">
              <div class="info-label">Logo de l'entreprise</div>
              <img src="${businessInfo.logoUrl}" alt="Logo ${businessInfo.name}" />
            </div>
          ` : ''}
        </div>

        <div class="section">
          <h3>👤 Informations du Candidat</h3>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Prénom</div>
              <div class="info-value">${applicantInfo.firstName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Nom</div>
              <div class="info-value">${applicantInfo.lastName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Email</div>
              <div class="info-value">
                <a href="mailto:${applicantInfo.email}" style="color: #2196F3; text-decoration: none;">
                  ${applicantInfo.email}
                </a>
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">Téléphone</div>
              <div class="info-value">
                <a href="tel:${applicantInfo.phone}" style="color: #2196F3; text-decoration: none;">
                  ${applicantInfo.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <a href="mailto:${applicantInfo.email}?subject=Candidature EliteReply - ${businessInfo.name}" class="btn btn-approve">
            ✉️ Répondre au Candidat
          </a>
          <a href="https://console.firebase.google.com" class="btn btn-review" target="_blank">
            📊 Voir dans Firebase
          </a>
        </div>

        <div class="footer">
          <p><strong>EliteReply - Système de Gestion des Partenariats</strong></p>
          <p>Cette candidature a été automatiquement enregistrée dans votre base de données Firebase.</p>
          <p style="margin-top: 15px; font-size: 0.9em; color: #888;">
            Email généré automatiquement - Ne pas répondre à cette adresse
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateConfirmationEmailHtml(applicationData) {
  const { businessInfo, applicantInfo } = applicationData;
  
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de Candidature - EliteReply</title>
      <style>
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px;
          background-color: #f7f9fc;
        }
        .header { 
          background: linear-gradient(135deg, #2196F3, #4CAF50); 
          color: white; 
          padding: 30px; 
          text-align: center; 
          border-radius: 12px 12px 0 0;
        }
        .content { 
          background: white; 
          padding: 30px; 
          border-radius: 0 0 12px 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .highlight { 
          background: #e8f5e8; 
          padding: 20px; 
          border-radius: 8px; 
          border-left: 4px solid #4CAF50;
          margin: 20px 0;
          text-align: center;
        }
        .next-steps {
          background: #f0f9ff;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #2196F3;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✅ Candidature Reçue</h1>
        <p style="margin: 0; opacity: 0.9;">Merci pour votre intérêt à rejoindre EliteReply</p>
      </div>
      
      <div class="content">
        <p>Bonjour <strong>${applicantInfo.firstName} ${applicantInfo.lastName}</strong>,</p>
        
        <div class="highlight">
          <h3 style="margin-top: 0; color: #4CAF50;">🎉 Votre candidature a été reçue avec succès !</h3>
          <p style="margin: 0;">Nous avons bien reçu votre candidature de partenariat pour <strong>${businessInfo.name}</strong>.</p>
        </div>

        <p>Notre équipe va examiner votre candidature et vous contacterons sous peu à l'adresse email <strong>${applicantInfo.email}</strong> pour vous informer de notre décision.</p>

        <div class="next-steps">
          <h4 style="color: #2196F3; margin-top: 0;">📋 Prochaines étapes :</h4>
          <ul>
            <li><strong>Examen de la candidature</strong> - Notre équipe examine votre profil</li>
            <li><strong>Évaluation</strong> - Nous vérifions la compatibilité avec nos critères</li>
            <li><strong>Réponse</strong> - Vous recevrez notre décision par email</li>
            <li><strong>Intégration</strong> - Si accepté, nous vous guiderons dans le processus d'intégration</li>
          </ul>
        </div>

        <p>En attendant, n'hésitez pas à visiter notre site web pour en savoir plus sur les avantages de rejoindre le réseau EliteReply.</p>

        <div class="footer">
          <p><strong>Équipe EliteReply</strong></p>
          <p>📧 Pour toute question : <a href="mailto:jeremytopaka@gmail.com" style="color: #2196F3;">jeremytopaka@gmail.com</a></p>
          <p style="margin-top: 15px; font-size: 0.9em; color: #888;">
            Cet email a été envoyé automatiquement suite à votre candidature de partenariat.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
