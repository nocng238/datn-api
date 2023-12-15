export function generateAppointmentNotiTemplate(
  logo_url: string,
  email: string,
  name: string,
) {
  return `<!DOCTYPE html>
  <html lang="en" dir="ltr">
      <head>
          <meta charset="utf-8" />
          <title>Tracelium</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style media="screen"></style>
          <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css?family=Inter"
          />
          <style>
    .tracelium-wrapper {
        margin: 0 auto;
        background-color: #f7f7f7;
        padding-top: 49px;
        padding-bottom: 42px;
    }
    .tracelium-container {
        background-color: #ffffff;
        width: 480px;
        margin: 0 auto;
    }
    .content {
        padding: 24px 40px 49px;
    }
    .logo {
        padding: 24px;
        text-align: center;
        background-color: #222222;
        border-radius: 4px;
    }
    .logo img {
        width: 132px;
        height: 32px;
    }
    .title {
        font-weight: 700;
        font-size: 16px;
        line-height: 26px;
        margin: 0;
        padding-bottom: 24px;
    }
    .subtitle {
        color: #7a7a7a;
        font-weight: 400;
        font-size: 14px;
        line-height: 24px;
        margin: 0;
        padding-bottom: 24px;
    }
    .subtitle a {
        text-decoration: none;
        color: #0a5af5;
    }
    .end {
        color: #0e0e0e;
        font-weight: 400;
        font-size: 14px;
        line-height: 26px;
        margin: 0;
    }
    .link-label {
        font-size: 14px;
        line-height: 24px;
        font-weight: 400;
        color: #111111;
        margin: 0;
    }
    .link {
        margin: 0;
        font-size: 14px;
        line-height: 24px;
        font-weight: 400;
        color: #0a5af5;
        padding-bottom: 24px;
    }
    .link a {
        text-decoration: none;
    }
    .note {
        padding-top: 48px;
        font-size: 12px;
        line-height: 18px;
        font-weight: 500;
        color: #7a7a7a;
    }
    .note a {
        text-decoration: none;
        color: #0a5af5;
    }
    .btn-container {
        display: flex;
        padding-bottom: 24px;
    }
    .verify-btn {
        padding: 12px 26px;
        color: #1d1d1d !important;
        background: linear-gradient(180deg, #ffd27a 0%, #fdbe44 100%);
        text-decoration: none;
        border-radius: 4px;
        box-sizing: border-box;
        font-weight: 600;
        font-size: 14px;
        line-height: 24px;
    }
</style>
      </head>
      <body>
          <div class="tracelium-wrapper">
              <div class="tracelium-container">
                  <div class="logo">
                      <img src="${logo_url}" alt="logo" />
                  </div>
                  <div class="content">
                      <h1 class="title">
                          <%= fullname %> (<%= project_owner_email %>) invited you
                          to join <%= name %> (<%= project_code %>)
                      </h1>
                      <% if(create_password_link){ %>
                      <p class="link"><a href="<%= link%>"><%= link%></a></p>
                      <p class="subtitle" style="color: black;">
                          If you don't have an account on Tracelium. Click button
                          below:
                      </p>
                      <div class="btn-container">
                          <a class="verify-btn" href="<%= create_password_link%>"
                              >Create account</a
                          >
                      </div>
                      <% } else{ %>
                      <p class="subtitle" style="color: black;">
                          Please click the button below to continue.
                      </p>
                      <div class="btn-container">
                          <a class="verify-btn" href="<%= link%>">Join Project</a>
                      </div>
  
                      <p class="link-label">Or use this link</p>
                      <p class="link"><a href="<%= link%>"><%= link%></a></p>
                      <% } %>
                      <p class="link-label">Thank you,</p>
                      <p class="link-label">Petcare team</p>
                      <p class="note">
                          If you were not anticipating this email, kindly get in
                          touch with
                          <a href="mailto:petcaren.noreply@gmail.com"
                              >petcaren.noreply@gmail.com</a
                          >
                      </p>
                  </div>
              </div>
          </div>
      </body>
  </html>
  `;
}
