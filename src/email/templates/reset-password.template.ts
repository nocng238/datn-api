export function generateResetPasswordTemplate(name: string, code: string) {
  return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <style type="text/css">
            @font-face {
                font-family: 'Balsamiq Sans';
                font-style: normal;
                font-weight: 400;
                src: url(https://fonts.gstatic.com/s/balsamiqsans/v3/P5sEzZiAbNrN8SB3lQQX7Pncwd4XIA.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
    
            * {
                font-family: 'Balsamiq Sans', sans-serif;
            }
    
            /* CLIENT-SPECIFIC STYLES */
            body,
            table,
            td,
            a {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
    
            table,
            td {
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }
    
            img {
                -ms-interpolation-mode: bicubic;
            }
    
            /* RESET STYLES */
            img {
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
            }
    
            table {
                border-collapse: collapse !important;
            }
    
            body {
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
            }
    
            /* iOS BLUE LINKS */
            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
            }
    
            /* MOBILE STYLES */
            @media screen and (max-width:600px) {
                h1 {
                    font-size: 32px !important;
                    line-height: 32px !important;
                }
            }
    
            /* ANDROID CENTER FIX */
            div[style*="margin: 16px 0;"] {
                margin: 0 !important;
            }
        </style>
    </head>
    
    <body
        style="background-image: url('https://res.cloudinary.com/dy9bbw3tu/image/upload/v1641528349/background_sawqsu.png'); margin: 0 !important; padding: 0 !important;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <!-- LOGO -->
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td align="center" valign="top" style="padding: 40px 10px 10px 10px;"> </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td align="center" valign="top" style="background: rgba(255, 255, 255, 0.5);
                  padding: 40px 20px 0px 20px; border-radius: 32px 32px 0px 0px;
                   color: #FF6489;">
                                <img src="https://res.cloudinary.com/dy9bbw3tu/image/upload/v1641528016/Group_1_xlldi9.png"
                                    style="display: block; border: 0px; padding: 30px 10px 30px 10px;" />
                                <p style="line-height: 30px;font-size: 24px; margin: 2; width: 400px;">RESET PASSWORD EMAIL
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 0px 10px 0px 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td align="center" style=" color: #666666;
                  line-height: 18px;background: rgba(255, 255, 255, 0.5);">
                                <p style=" margin: 0;font-size: 16px; width: 400px;">
                                    Dear ${name},
                                    you're receiving this e-mail because you requested a password reset for your user
                                    account at Lovespace.
                                    This is your code:
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center"
                                            style="padding: 0px 30px 0px 30px; background: rgba(255, 255, 255, 0.5);">
                                            <table border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td align="center">
                                                        <p style="font-size: 30px; width: 200px;
                                background: linear-gradient(90deg, #F09DC5 0%, #FF5B79 100%);
                                text-decoration: none; color: #FFFFFF; text-decoration: none; padding: 15px 25px;
                                border-radius: 16px; display: inline-block;">
                                                            <b>${code}</b>
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style=" color: #949393;
                  line-height: 18px;background: rgba(255, 255, 255, 0.5);
                  border-radius: 0px 0px 32px 32px;padding: 20px 30px 50px 30px;">
                                <p style=" margin: 0;font-size: 16px; width: 400px;">
                                    The code expires in 5 minutes, please do not share it to anyone.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    
    </html>`;
}
