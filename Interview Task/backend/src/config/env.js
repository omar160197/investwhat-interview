import dotenv from 'dotenv';
dotenv.config();

const required = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env variable: ${key}`);
  return value;
};

export const env = {
  port:               process.env.PORT || 5000,
  nodeEnv:            process.env.NODE_ENV || 'development',
  mongoUri:           required('MONGO_URI'),
  jwt: {
    accessSecret:     required('JWT_ACCESS_SECRET'),
    refreshSecret:    required('JWT_REFRESH_SECRET'),
    accessExpires:    process.env.JWT_ACCESS_EXPIRES  || '15m',
    refreshExpires:   process.env.JWT_REFRESH_EXPIRES || '7d',
  },
  googleAiApiKey:     process.env.GOOGLE_AI_API_KEY || '',
  openRouterApiKey:   process.env.OPENROUTER_API_KEY || '',
  smtp: {
    host:   process.env.SMTP_HOST || 'smtp.gmail.com',
    port:   Number(process.env.SMTP_PORT) || 587,
    user:   process.env.SMTP_USER || '',
    pass:   process.env.SMTP_PASS || '',
    from:   process.env.SMTP_FROM || 'Invest Interview <noreply@investinterview.com>',
  },
  clientUrl:          process.env.CLIENT_URL || 'http://localhost:5173',
};
