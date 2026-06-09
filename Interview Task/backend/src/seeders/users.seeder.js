import User from '../modules/auth/auth.model.js';

const USERS = [
  { name: 'Admin User',    email: 'admin@invest.com',           password: 'password123', role: 'admin' },
  { name: 'Ahmed Ali',     email: 'ahmeedali322322@gmail.com',  password: 'password123', role: 'user'  },
  { name: 'Sarah Johnson', email: 'sarah@invest.com',           password: 'password123', role: 'user'  },
  { name: 'James Wilson',  email: 'james@invest.com',           password: 'password123', role: 'user'  },
  { name: 'Emily Chen',    email: 'emily@invest.com',           password: 'password123', role: 'user'  },
  { name: 'Michael Brown', email: 'michael@invest.com',         password: 'password123', role: 'user'  },
  { name: 'Lisa Davis',    email: 'lisa@invest.com',            password: 'password123', role: 'user'  },
  { name: 'Robert Taylor', email: 'robert@invest.com',          password: 'password123', role: 'user'  },
  { name: 'Anna Martinez', email: 'anna@invest.com',            password: 'password123', role: 'user'  },
];

export const seedUsers = async () => {
  let added = 0;
  for (const u of USERS) {
    const exists = await User.findOne({ email: u.email });
    if (exists) continue;
    await User.create({
      ...u,
      avatar: u.name.split(' ').slice(0, 2).map((w) => w[0].toUpperCase()).join(''),
    });
    added++;
  }
  if (added > 0) console.log(`✓ ${added} user(s) seeded`);
  else console.log('Users already up to date, skipping');
  console.log('  Admin → admin@invest.com / password123');
};
