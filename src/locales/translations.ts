export const translations = {
  en: {
    userNotAuthenticated: "User not authenticated",
    notificationMarkedRead: "Notification marked as read",
    //login,registration
     registrationSuccess: "Registration successful. Please verify your email.",
    loginSuccess: "Login successful",
     invalidCredentials: "Invalid credentials",
    accountNotActive: "Account not active. Verify email or contact support.",
    invalidPassword: "Invalid password",

    //
  },
  it: {
    userNotAuthenticated: "Utente non autenticato",
    notificationMarkedRead: "Notifica contrassegnata come letta",
    //login,registration
      registrationSuccess: "Registrazione completata. Si prega di verificare la tua email.",
    loginSuccess: "Accesso riuscito",
    invalidCredentials: "Credenziali non valide",
    accountNotActive: "Account non attivo. Verifica l'email o contatta il supporto.",
    invalidPassword: "Password non valida",
  },
  al: {
    userNotAuthenticated: "Përdoruesi nuk është autentikuar",
    notificationMarkedRead: "Njoftimi u shënua si i lexuar",
    //login,registration
     registrationSuccess: "Regjistrimi u krye me sukses. Ju lutemi verifikoni email-in tuaj.",
    loginSuccess: "Hyrja ishte e suksesshme",
      invalidCredentials: "Të dhënat e identifikimit nuk janë të sakta",
    accountNotActive: "Llogaria nuk është aktive. Verifikoni email-in ose kontaktoni mbështetjen.",
    invalidPassword: "Fjalëkalim i pavlefshëm",
  },
} as const;

export type SupportedLang = keyof typeof translations;