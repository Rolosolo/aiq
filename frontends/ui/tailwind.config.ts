// SPDX-FileCopyrightText: Copyright (c) 2025-2026, NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/adapters/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nvidia/foundations-react-core/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // CoralFil Brand
        'teal-primary': '#00D9C0',
        'teal-light': '#E0F7FF',
        'coral': '#FF6B35',
        'coral-red': '#FF4B5C',
        'gray-oyster': '#8B9DC3',
        'green-prebiotic': '#2ECC71',
        // Threats
        'threat-vibrio': '#9B59B6',
        'threat-poms': '#E74C3C',
        'threat-acidif': '#3498DB',
        'threat-thermal': '#FF6B35',
        // Neutrals
        'bg-dark': '#010307',
        'bg-secondary': '#02060c',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0AEC0',
        'border-dark': '#1E293B',
      },
    },
  },
  plugins: [],
}

export default config
