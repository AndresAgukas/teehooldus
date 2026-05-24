'use client'

import { useState } from 'react'
import { supabase } from './lib/supabase'

export default function Home() {
  const [kirjeldus, setKirjeldus] = useState('')
  const [salvestatud, setSalvestatud] = useState(false)
  const [laadimine, setLaadimine] = useState(false)

  const salvestaPuudus = async () => {
    if (!kirjeldus.trim()) return
    setLaadimine(true)

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { error } = await supabase.from('puudused').insert({
        kirjeldus,
        asukoht_lat: pos.coords.latitude,
        asukoht_lng: pos.coords.longitude,
      })

      if (!error) {
        setSalvestatud(true)
        setKirjeldus('')
        setTimeout(() => setSalvestatud(false), 3000)
      }
      setLaadimine(false)
    }, () => {
      supabase.from('puudused').insert({ kirjeldus }).then(() => {
        setSalvestatud(true)
        setKirjeldus('')
        setTimeout(() => setSalvestatud(false), 3000)
        setLaadimine(false)
      })
    })
  }

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
        Teedehooldus
      </h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Meistri puuduste register
      </p>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
          Puuduse kirjeldus
        </label>
        <textarea
          value={kirjeldus}
          onChange={(e) => setKirjeldus(e.target.value)}
          placeholder="Kirjelda puudust..."
          rows={4}
          style={{
            width: '100%',
            padding: 12,
            border: '1px solid #ddd',
            borderRadius: 8,
            fontSize: 16,
            boxSizing: 'border-box',
          }}
        />
      </div>

      <button
        onClick={salvestaPuudus}
        disabled={laadimine || !kirjeldus.trim()}
        style={{
          width: '100%',
          padding: 14,
          background: laadimine ? '#ccc' : '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 500,
          cursor: laadimine ? 'default' : 'pointer',
        }}
      >
        {laadimine ? 'Salvestan...' : 'Salvesta puudus'}
      </button>

      {salvestatud && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: '#d1fae5',
            borderRadius: 8,
            color: '#065f46',
            textAlign: 'center',
          }}
        >
          ✅ Puudus salvestatud!
        </div>
      )}
    </main>
  )
}
