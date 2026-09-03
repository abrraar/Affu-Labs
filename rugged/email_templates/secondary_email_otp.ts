import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    const { email, otp } = await req.json()

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? ""

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Secondary Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0D0D0D !important; font-family: 'Impact', 'Anon', 'Arial Black', sans-serif;">
<table role="presentation" style="width: 100%; background-color: #0D0D0D; table-layout: fixed; border-collapse: collapse;">
  <tr>
    <td style="text-align: center; padding: 60px 0;">
      <table align="center" role="presentation" style="width: 100%; max-width: 500px; padding: 0 25px; border-collapse: collapse; margin: 0 auto;">

        <!-- Logo (Left Aligned) -->
        <tr>
          <td style="text-align: left; padding-bottom: 40px;">
              <div style="font-family: 'Impact', 'Anon', 'Arial Black', sans-serif; font-size: 20px; letter-spacing: 4px; color: #FFFFFF; text-transform: uppercase;">
                  RUGGED <span style="color: #8B1A2F;">APP</span>
              </div>
          </td>
        </tr>

        <!-- Header (Left Aligned) -->
        <tr>
          <td style="text-align: left; padding-bottom: 5px;">
            <h1 style="font-family: 'Impact', 'Anon', 'Arial Black', sans-serif; font-size: 48px; line-height: 0.9; font-weight: 400; letter-spacing: 1px; color: #FFFFFF; margin: 0; text-transform: uppercase;">
              VERIFY<br>IDENTITY
            </h1>
          </td>
        </tr>

        <!-- Subtitle (Left Aligned) -->
        <tr>
          <td style="text-align: left; padding-bottom: 40px;">
            <div style="font-family: 'Impact', 'Anon', 'Arial Black', sans-serif; color: #8B1A2F; font-size: 11px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase;">
              SECONDARY EMAIL PROTOCOL
            </div>
          </td>
        </tr>

        <!-- Action Card (Center Aligned) -->
        <tr>
          <td style="background-color: #1A1A1A; border: 1px solid #333333; padding: 40px 30px; border-radius: 4px; text-align: center;">
            <p style="font-family: 'Impact', 'Anon', 'Arial Black', sans-serif; font-size: 14px; font-weight: 300; color: #CCCCCC; margin: 0 0 30px 0; line-height: 1.6;">
              YOU ARE UPDATING YOUR ACCOUNT SECURITY SETTINGS. YOUR AUTHORIZATION OTP IS PROVIDED BELOW:
            </p>

            <!-- OTP Box -->
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="text-align: center; border: 2px solid #8B1A2F; padding: 20px 0; background-color: #080808; border-radius: 8px;">
                  <span style="font-family: 'Impact', 'Anon', 'Arial Black', sans-serif; font-size: 48px; color: #FFFFFF; letter-spacing: 8px; margin-left: 8px;">
                    ${otp}
                  </span>
                </td>
              </tr>
            </table>

            <p style="font-family: 'Impact', 'Anon', 'Arial Black', sans-serif; font-size: 11px; color: #666666; font-weight: 700; margin: 30px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">
              AUTHORIZATION EXPIRES IN 15 MINUTES
            </p>
          </td>
        </tr>

        <!-- Footer (Center Aligned) -->
        <tr>
          <td style="text-align: center; padding-top: 60px;">
            <div style="width: 40px; height: 3px; background-color: #8B1A2F; margin: 0 auto 20px auto;"></div>
            <p style="font-family: 'Impact', 'Anon', 'Arial Black', sans-serif; font-size: 22px; color: #333333; margin: 0; letter-spacing: 2px; text-transform: uppercase;">
              INTENSE. BRIEF. INFREQUENT.
            </p>
            <p style="font-family: 'Impact', 'Anon', 'Arial Black', sans-serif; font-size: 11px; color: #444444; font-weight: 400; text-transform: uppercase; letter-spacing: 2px; margin: 10px 0 0 0;">
              &copy; 2026 <a href="https://affulabs.com/rugged" style="color: #444444; text-decoration: none;">AFFULABS.COM/RUGGED</a>
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Rugged <rugged@affulabs.com>",
        to: [email],
        subject: "VERIFICATION PROTOCOL: Secondary Email",
        html: htmlContent,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
