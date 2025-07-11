# EasyCV

An AI-powered CV and cover letter generation platform built with React Router v7, Vite, shadcn/ui, Vercel's AI sdk and Supabase.

## About

EasyCV helps users create professional, ATS-friendly CVs and cover letters in minutes. The platform leverages AI to analyze user experience and suggest the best way to present skills and qualifications.

This project is based on a fork of [remix-shadcn-boilerplate](https://github.com/davidculemann/remix-shadcn-boilerplate), and has been migrated to use React Router v7.

## What's inside?

- A full-featured AI CV and cover letter generation platform
- Complete authentication flow with Supabase
  - Signup with email, Google, Github
  - Login with email, Google, Github
  - Forgot password flow
  - Logout
- Protected routes
- Professional dashboard layout for CV management
- Beautiful landing page explaining the platform's features
- Interactive CV profile builder with completion tracking
- CV export and formatting options

## Setup

- Clone the repo:

```sh
git clone git@github.com:yourusername/easycv.git
```

- Install dependencies:

```sh
pnpm install
```

## Stripe

In order to use Stripe Subscriptions and seed the database, you'll need to create a [Stripe Account](https://dashboard.stripe.com/login) and get the secret key from the Stripe Dashboard.

1. Create a [Stripe Account](https://dashboard.stripe.com/login) or use an existing one.
2. Visit [API Keys](https://dashboard.stripe.com/test/apikeys) section and copy the `Secret` key.
3. Paste your secret key into `.env` file as `STRIPE_SECRET_KEY`.

## Stripe Webhook

1. In order to start receiving Stripe Events to our Webhook Endpoint, you need to install the [Stripe CLI.](https://stripe.com/docs/stripe-cli) Once installed run the following command in your console. _(Make sure you're in the root of your project)_:

```sh
stripe login
```

```sh
stripe listen --forward-to localhost:3000/api/webhook
```

This should give you a Webhook Secret Key. Copy and paste it into your `.env` file as `STRIPE_WEBHOOK_ENDPOINT`.

> [!IMPORTANT]
> This command should be running in your console while developing, especially when testing or handling Stripe Events.

2. Then, you can run the seed command to populate your stripe store with products and prices (skip this if you want to seed Supabase as well - this is covered in the next section below).

```sh
pnpm run seed
```

### Supabase

- Create a new project on [Supabase](https://supabase.io)

- enter your Supabase secrets in `.env`, the service role key is found in the API settings of your Supabase project

```sh
SUPABASE_URL=https://<your_supabase_url>.supabase.co
SUPABASE_ANON_KEY=<your_supabase_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_supabase_service_role_key>
```

- connect to the supabase project and run the initialisation migrations:

```sh
pnpm supabase link   
```

```sh
pnpm supabase db push
```

- seed the database:

```sh
pnpm run seed
```

- generate typescript types for your Supabase tables:

```sh
supabase gen types typescript --project-id <your_supabase_project_id> > db_types.ts
```

## Email

- Supabase aggressively rate limits your email sending on the free plan, so you'll need to use a third-party email service. I recommend [Resend](https://resend.com) for this. Add the supabase integration here: https://resend.com/settings/integrations.

- The auth flow currently works with OTP emailed to the user. To configure this, you'll need to go to `/auth/templates` in your supabase dashboard and add the following templates:

1. Confirm signup:

```html
<h2>Confirm Your Signup</h2>

<p>Your verification code is: <strong>{{ .Token }}</strong></p>
<p>This code will expire in 5 minutes. Please use it to complete your signup process.</p>
```

2. Reset Password:

```html
<h2>Reset Password</h2>
<p>Follow this link to reset the password for your user:</p>
<p><a href="{{ .RedirectTo }}/api/auth/confirm?token_hash={{ .TokenHash }}&type=email&email={{ .Email }}">Reset Password</a></p>
```

## Development

1. Seed the database:

```sh
pnpm run seed
```

2. Run the Vite dev server:

```sh
npm run dev
```

## Stack

- [React Router v7](https://reactrouter.com/)
- [Vite](https://vitejs.dev)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.io)
- [OpenAI](https://openai.com) (AI integration)
- [React Query](https://react-query.tanstack.com)
- [Framer Motion](https://www.framer.com/motion)
- [Resend](https://resend.io)
- [zustand](https://zustand.surge.sh)
- [Stripe](https://stripe.com)

## Tooling

- [Biome](https://biomejs.dev)
- [pnpm](https://pnpm.io)
- [Vite](https://vitejs.dev)
- [Vercel](https://vercel.com)

## Credits

- [remix-shadcn-boilerplate](https://github.com/davidculemann/remix-shadcn-boilerplate): The original boilerplate this project is based on.
- [shadcn-ui-sidebar](https://github.com/salimi-my/shadcn-ui-sidebar): Professional yet beautiful dashboard layout built with shadcn, adapted from Next-js.
