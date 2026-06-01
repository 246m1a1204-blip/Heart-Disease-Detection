import React, { useState } from 'react';

export default function Auth({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Patient');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      return setErrorMessage('Validation Alert: Input fields cannot be empty.');
    }

    // Direct dynamic endpoints allocation checking matching table schemas
    const endpoint = isSignUp 
      ? 'http://127.0.0.1:8000/api/v1/auth/signup' 
      : 'http://127.0.0.1:8000/api/v1/auth/login';

    const payload = isSignUp 
      ? { email, password, role } 
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication server rejected this action.');
      }

      if (isSignUp) {
        // Postgres query success handler trace setup
        setSuccessMessage('Registration successful! Your credentials are saved in Postgres. Please Sign In now.');
        setIsSignUp(false); // Shifts state framework view back to login portal screen
        setPassword('');
      } else {
        // Session validation check blocks criteria matching database row structure
        if (data.status === "Authenticated") {
          onAuthSuccess(data.role);
        } else {
          setErrorMessage("Authentication Error: Failed to fetch secure profile context.");
        }
      }

    } catch (err) {
      console.error("Authentication handshake failure catch path:", err);
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-zinc-100 mb-6 flex items-center justify-center gap-2">
          ❤️ Heart Disease AI Portal
        </h2>
        
        {errorMessage && (
          <div className="mb-4 bg-red-950/50 border border-red-800 text-red-400 p-3 rounded-lg text-sm text-center font-medium">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-emerald-950/50 border border-emerald-800 text-emerald-400 p-3 rounded-lg text-sm text-center font-medium">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:border-emerald-500 outline-none transition-colors text-sm" placeholder="user@example.com" required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:border-emerald-500 outline-none transition-colors text-sm" placeholder="••••••••" required />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Select Portal Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:border-emerald-500 outline-none transition-colors text-sm">
                <option value="Patient">Patient</option>
                <option value="Medical Doctor">Medical Doctor</option>
              </select>
            </div>
          )}

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg transition-colors text-sm cursor-pointer mt-2 shadow-lg">
            {isSignUp ? 'Sign Up (Save to Database)' : 'Log In Secure Session'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button onClick={() => { setIsSignUp(!isSignUp); setErrorMessage(''); setSuccessMessage(''); }} className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors underline bg-transparent border-none cursor-pointer">
            {isSignUp ? "Already registered? Sign In matrix portal" : "New configuration? Sign Up new account"}
          </button>
        </div>
      </div>
    </div>
  );
}