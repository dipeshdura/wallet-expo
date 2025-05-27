
---

## ⚙️ Setup Instructions

### 🔧 Prerequisites

Before starting, ensure you have:

- Node.js installed
- npm or Yarn installed
- A [NeonDB](https://neon.tech/) account
- An [Upstash Redis](https://upstash.com/) account
- A [Clerk](https://clerk.dev/) account for authentication

---

### 🚀 Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/wallet.git
cd wallet

# Install backend dependencies
cd backend
npm install

# Install neondatabase for database
npm i @neondatabase/serverless@1.0.0

# Install clerk for authentication
npm i @clerk/clerk-expo

# Install upstash for redis
npm i @upstash/redis@1.34.9

# Install frontend dependencies
cd ../mobile
npm install
