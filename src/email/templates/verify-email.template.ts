export function generateVerifyEmailTemplate(verificationUrl: string) {
  return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <style type="text/css">
            * {
                font-family: sans-serif;
            }
            body {
                margin: 0 !important; 
                padding: 0 !important;
                height: 100%;
            
                /* Center and scale the image nicely */
                background-position: center;
                background-attachment: fixed;
                background-repeat: no-repeat; 
                background-size: cover;
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
        style="background-image: url('https://res.cloudinary.com/dy9bbw3tu/image/upload/v1649322542/background_sroqk4.jpg'); margin: 0 !important; padding: 0 !important;">
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
                            <td align="center" valign="top" style="background: rgba(255, 255, 255, 0.7);
                  padding: 40px 20px 0px 20px; border-radius: 32px 32px 0px 0px;">
                                <div style="display: block; border: 0px; padding: 30px 10px 30px 10px;" ></div>
                                <p style="line-height: 30px;font-size: 24px; margin: 2; width: 450px;">THANKS FOR
                                    SIGNING UP FOR <br>VP AIRLINES </p>
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
                  line-height: 18px;background: rgba(255, 255, 255, 0.7);">
                                <p style=" margin: 0;font-size: 16px; width: 450px;">
                                    We're excited to have you get started. First, you need to verify
                                    your account. Just
                                    press the button below.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td align="left">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td align="center"
                                            style="padding: 20px 30px 60px 30px; background: rgba(255, 255, 255, 0.7); border-radius: 0px 0px 32px 32px;">
                                            <table border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td align="center"><a href="${verificationUrl}" target="_blank" style="font-size: 20px; width: 300px;
                                background-color: #f8b600;
                                text-decoration: none; color: #FFFFFF; text-decoration: none; padding: 15px 25px;
                                border-radius: 16px; display: inline-block;">
                                                            Verify Account</a></td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    
    </html>`;
}
