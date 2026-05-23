import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!)
  return _resend
}

const FROM = 'TrackAds <noreply@trackads.iamanager.fr>'

// ─── Email : nouvelle pub qui cartonne ───────────────────────────────────────

export async function sendWinnerAdAlert(opts: {
  to: string
  advertiser: string
  score: number
  runDays: number
  niche: string
  productType: string
  price: string
  adText: string
  adUrl: string
}) {
  const preview = opts.adText.slice(0, 120) + (opts.adText.length > 120 ? '...' : '')

  return getResend().emails.send({
    from: FROM,
    to: opts.to,
    subject: `🔥 Nouvelle pub winner détectée — ${opts.advertiser} (score ${opts.score})`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#FFFBF7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">

    <!-- Header -->
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
      <div style="width:36px;height:36px;background:linear-gradient(135deg,#F97316,#FB923C);border-radius:10px;display:flex;align-items:center;justify-content:center;">
        <span style="color:white;font-size:16px;">📈</span>
      </div>
      <span style="font-size:18px;font-weight:900;color:#1C1917;">TrackAds</span>
    </div>

    <!-- Alert badge -->
    <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.2);border-radius:999px;padding:4px 12px;margin-bottom:16px;">
      <span style="width:6px;height:6px;background:#F97316;border-radius:50%;display:inline-block;"></span>
      <span style="font-size:12px;font-weight:700;color:#F97316;">Pub winner détectée</span>
    </div>

    <h1 style="font-size:22px;font-weight:900;color:#1C1917;margin:0 0 8px;">
      ${opts.advertiser} cartonne 🔥
    </h1>
    <p style="font-size:14px;color:rgba(28,25,23,0.5);margin:0 0 24px;">
      Cette pub vient d'atteindre un score de <strong style="color:#F97316;">${opts.score}/100</strong>
    </p>

    <!-- Stats -->
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:24px;">
      <div style="background:white;border:1px solid rgba(28,25,23,0.08);border-radius:12px;padding:14px;text-align:center;">
        <div style="font-size:22px;font-weight:900;color:#1C1917;">${opts.runDays}j</div>
        <div style="font-size:11px;color:rgba(28,25,23,0.4);margin-top:2px;">Actif</div>
      </div>
      <div style="background:white;border:1px solid rgba(28,25,23,0.08);border-radius:12px;padding:14px;text-align:center;">
        <div style="font-size:13px;font-weight:800;color:#1C1917;">${opts.productType}</div>
        <div style="font-size:11px;color:rgba(28,25,23,0.4);margin-top:2px;">Produit</div>
      </div>
      <div style="background:white;border:1px solid rgba(28,25,23,0.08);border-radius:12px;padding:14px;text-align:center;">
        <div style="font-size:14px;font-weight:900;color:#F97316;">${opts.price}</div>
        <div style="font-size:11px;color:rgba(28,25,23,0.4);margin-top:2px;">Prix</div>
      </div>
    </div>

    <!-- Niche -->
    <div style="margin-bottom:16px;">
      <span style="background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.15);color:#7C3AED;font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;">${opts.niche}</span>
    </div>

    <!-- Ad preview -->
    <div style="background:white;border:1px solid rgba(28,25,23,0.08);border-radius:14px;padding:16px;margin-bottom:24px;">
      <div style="font-size:10px;font-weight:700;color:rgba(28,25,23,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Aperçu du copy</div>
      <p style="font-size:13px;color:rgba(28,25,23,0.7);line-height:1.6;margin:0;">"${preview}"</p>
    </div>

    <!-- CTA -->
    <a href="https://trackads.iamanager.fr/ads"
       style="display:block;background:linear-gradient(135deg,#F97316,#FB923C);color:white;text-decoration:none;text-align:center;padding:14px 24px;border-radius:12px;font-weight:700;font-size:14px;margin-bottom:32px;">
      Voir la pub complète →
    </a>

    <!-- Footer -->
    <p style="font-size:11px;color:rgba(28,25,23,0.3);text-align:center;margin:0;">
      TrackAds · Tu reçois cet email car tu surveilles les pubs winners.<br>
      <a href="https://trackads.iamanager.fr/settings" style="color:rgba(28,25,23,0.3);">Se désabonner</a>
    </p>

  </div>
</body>
</html>
    `,
  })
}

// ─── Email : bienvenue onboarding ────────────────────────────────────────────

export async function sendWelcomeEmail(opts: { to: string; name: string }) {
  return getResend().emails.send({
    from: FROM,
    to: opts.to,
    subject: `Bienvenue sur TrackAds, ${opts.name?.split(' ')[0] || 'ami'} 👋`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#FFFBF7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">

    <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
      <div style="width:36px;height:36px;background:linear-gradient(135deg,#F97316,#FB923C);border-radius:10px;">
      </div>
      <span style="font-size:18px;font-weight:900;color:#1C1917;">TrackAds</span>
    </div>

    <h1 style="font-size:24px;font-weight:900;color:#1C1917;margin:0 0 12px;">
      Bienvenue, ${opts.name?.split(' ')[0] || 'ami'} 🎉
    </h1>
    <p style="font-size:14px;color:rgba(28,25,23,0.6);line-height:1.7;margin:0 0 28px;">
      Tu as accès à la plateforme qui te permet de spy les tunnels et pubs qui cartonnent,
      et de générer tes propres VSL en quelques secondes.
    </p>

    <div style="background:white;border:1px solid rgba(28,25,23,0.08);border-radius:16px;padding:20px;margin-bottom:24px;">
      <div style="font-size:12px;font-weight:800;color:rgba(28,25,23,0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:16px;">Par où commencer</div>
      ${[
        { emoji: '🕵️', title: 'Spy les pubs winners', desc: 'Filtre par niche et trouve les meilleures pubs actives', href: '/ads' },
        { emoji: '🔗', title: 'Importer un tunnel', desc: 'Analyse n\'importe quelle page de vente en 30s', href: '/tunnels/import' },
        { emoji: '🎬', title: 'Générer une VSL', desc: 'Crée ton script vidéo de vente avec l\'IA', href: '/vsl' },
      ].map(item => `
        <div style="display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid rgba(28,25,23,0.05);">
          <span style="font-size:20px;">${item.emoji}</span>
          <div>
            <div style="font-size:13px;font-weight:700;color:#1C1917;">${item.title}</div>
            <div style="font-size:12px;color:rgba(28,25,23,0.45);margin-top:2px;">${item.desc}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <a href="https://trackads.iamanager.fr"
       style="display:block;background:linear-gradient(135deg,#F97316,#FB923C);color:white;text-decoration:none;text-align:center;padding:14px 24px;border-radius:12px;font-weight:700;font-size:14px;margin-bottom:32px;">
      Accéder à TrackAds →
    </a>

    <p style="font-size:11px;color:rgba(28,25,23,0.3);text-align:center;margin:0;">
      TrackAds · intelligence publicitaire pour infopreneurs
    </p>
  </div>
</body>
</html>
    `,
  })
}
