export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px', fontFamily: 'sans-serif', color: '#1C1917' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Politique de confidentialité</h1>
      <p style={{ color: 'rgba(28,25,23,0.5)', marginBottom: 40 }}>Dernière mise à jour : mai 2025</p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>1. Collecte des données</h2>
        <p style={{ lineHeight: 1.7, color: 'rgba(28,25,23,0.7)' }}>
          TrackAds collecte uniquement les données nécessaires au fonctionnement du service : adresse email, nom d'utilisateur fournis lors de l'inscription via Google OAuth. Nous collectons également des données d'utilisation anonymisées pour améliorer l'expérience utilisateur.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>2. Utilisation des données</h2>
        <p style={{ lineHeight: 1.7, color: 'rgba(28,25,23,0.7)' }}>
          Vos données sont utilisées exclusivement pour : l'authentification et l'accès à votre compte, la personnalisation de votre expérience sur la plateforme, et l'envoi de notifications liées à votre compte si vous y avez consenti.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>3. Partage des données</h2>
        <p style={{ lineHeight: 1.7, color: 'rgba(28,25,23,0.7)' }}>
          Nous ne vendons ni ne partageons vos données personnelles avec des tiers, sauf obligation légale. Nous utilisons Supabase pour le stockage sécurisé des données.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>4. Cookies</h2>
        <p style={{ lineHeight: 1.7, color: 'rgba(28,25,23,0.7)' }}>
          TrackAds utilise des cookies de session pour maintenir votre connexion. Aucun cookie publicitaire ou de suivi tiers n'est utilisé.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>5. Vos droits</h2>
        <p style={{ lineHeight: 1.7, color: 'rgba(28,25,23,0.7)' }}>
          Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@trackads.fr" style={{ color: '#F97316' }}>contact@trackads.fr</a>
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>6. Contact</h2>
        <p style={{ lineHeight: 1.7, color: 'rgba(28,25,23,0.7)' }}>
          Pour toute question relative à cette politique : <a href="mailto:contact@trackads.fr" style={{ color: '#F97316' }}>contact@trackads.fr</a>
        </p>
      </section>
    </div>
  )
}
