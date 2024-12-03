# Xanta - Your Secret Santa Organizer

Xanta is a simple web application that helps you organize Secret Santa gift exchanges effortlessly.  It randomly assigns participants and sends email notifications to each person, letting them know who they're buying a gift for.  No more manual drawings or complicated spreadsheets!

## Features

* **Easy participant entry:**  Input names and email addresses directly into the web form.
* **Random assignment:** Xanta automatically shuffles and assigns Santas, ensuring a fair and secret process.
* **Email notifications:** Each participant receives an email revealing their assigned recipient.
* **Privacy-focused:**  No data is stored.  Participant information is used solely for the purpose of the Secret Santa assignment and email delivery.
* **Simple and intuitive UI:**  Get started quickly with the easy-to-use interface.

## How to Use

1. **Add participants:** Enter the name and email address of each person participating in the Secret Santa.  A minimum of three participants are required.
2. **Submit:** Click the "Submit the form" button. Xanta will randomly assign recipients and send emails to each participant.
3. **Check your email:** Participants will receive an email informing them who they are buying a gift for.

## Development

This project is built with Next.js and uses Nodemailer for sending emails.

**Prerequisites:**

* Node.js and npm (or yarn)
* An email provider account (e.g., Mail.ru, Gmail) and its SMTP settings for Nodemailer configuration.

**Setup:**

1. Clone the repository: `git clone https://github.com/ptrglbvc/xanta.git`
2. Install dependencies: `npm install` or `yarn install`
3. Create a `.env.local` file in the root directory and configure the following environment variables:
   ```
   EMAIL=your_email@provider.com
   EMAIL_PASSWORD=your_email_password
   ```
4. Start the development server: `npm run dev` or `yarn dev`

**Deployment:**

This project can be easily deployed on platforms like Vercel, Netlify, or other Next.js compatible hosting services.  Consult their respective documentation for specific instructions.


## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any suggestions or improvements.


## License

This project is licensed under the [MIT License](LICENSE).

