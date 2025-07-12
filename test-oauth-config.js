#!/usr/bin/env node

/**
 * OAuth Configuration Test Script
 * Tests Google and Microsoft OAuth configurations for both local and production environments
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('🔍 OAuth Configuration Test\n');

// Test environment variables
console.log('📋 Environment Variables:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL || 'Using default localhost');

console.log('MICROSOFT_CLIENT_ID:', process.env.MICROSOFT_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('MICROSOFT_CLIENT_SECRET:', process.env.MICROSOFT_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
console.log('MICROSOFT_CALLBACK_URL:', process.env.MICROSOFT_CALLBACK_URL || 'Using default localhost');

console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');

console.log('\n🔗 Expected Callback URLs:');
console.log('Local Development:');
console.log('  Google: http://localhost:3000/auth/google/callback');
console.log('  Microsoft: http://localhost:3000/auth/microsoft/callback');

console.log('\nProduction (Railway):');
console.log('  Google: https://waypoint-production-5b75.up.railway.app/auth/google/callback');
console.log('  Microsoft: https://waypoint-production-5b75.up.railway.app/auth/microsoft/callback');

console.log('\n📝 Google Cloud Console Setup Required:');
console.log('1. Go to Google Cloud Console > APIs & Services > Credentials');
console.log('2. Edit your OAuth 2.0 Client ID');
console.log('3. Add both callback URLs to "Authorized redirect URIs":');
console.log('   - http://localhost:3000/auth/google/callback');
console.log('   - https://waypoint-production-5b75.up.railway.app/auth/google/callback');

console.log('\n📝 Railway Environment Variables Required:');
console.log('Update these in your Railway dashboard:');
console.log('GOOGLE_CALLBACK_URL=https://waypoint-production-5b75.up.railway.app/auth/google/callback');
console.log('MICROSOFT_CALLBACK_URL=https://waypoint-production-5b75.up.railway.app/auth/microsoft/callback');

console.log('\n✅ Test Complete');
