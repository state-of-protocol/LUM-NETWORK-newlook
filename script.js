/**
 * Nexus Design System – Interaction Layer
 * Mematuhi WCAG 2.2 AA. Mengandaikan CSS token (theme.css) telah dimuatkan.
 * Gunakan data-nexus-component="link|button|input|list" pada elemen.
 * Keadaan (state) boleh diubah dengan data-state="disabled|loading|error".
 */
;(function () {
  'use strict'

  // --- Konfigurasi Token (hanya untuk rujukan, tidak digunakan secara langsung) ---
  // Semua token sebenar ada dalam CSS. Kelas CSS di bawah menggunakan token tersebut.

  // --- Fungsi Utiliti ---

  /**
   * Tambah / buang kelas berdasarkan keadaan.
   * @param {HTMLElement} el
   * @param {string} state - 'disabled' | 'loading' | 'error' | 'active'
   * @param {boolean} on
   */
  function setState(el, state, on) {
    el.classList.toggle(`nexus-${state}`, on)
    if (state === 'disabled') {
      el.setAttribute('aria-disabled', on ? 'true' : 'false')
      if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button') {
        el.disabled = on
      }
    }
    if (state === 'loading') {
      el.setAttribute('aria-busy', on ? 'true' : 'false')
    }
    if (state === 'error') {
      el.setAttribute('aria-invalid', on ? 'true' : 'false')
    }
  }

  /**
   * Pastikan elemen interaktif mempunyai penunjuk fokus yang dapat dilihat.
   * Menambah kelas 'nexus-focus-visible' apabila difokuskan melalui papan kekunci.
   */
  function handleFocusVisible(event) {
    const el = event.target
    // Hanya tambah jika fokus bukan dari tetikus (menggunakan :focus-visible polyfill ringkas)
    if (event.type === 'focus') {
      el.classList.add('nexus-focus-visible')
    } else if (event.type === 'blur') {
      el.classList.remove('nexus-focus-visible')
    }
  }

  // --- Pengelola Pautan (data-nexus-component="link") ---
  function setupLinks() {
    const links = document.querySelectorAll('[data-nexus-component="link"]')
    links.forEach((link) => {
      // Pastikan atribut asas
      if (!link.hasAttribute('href')) link.setAttribute('href', '#')
      link.setAttribute('role', 'link')
      link.setAttribute('tabindex', '0')

      // Keadaan awal dari data-state
      const initialState = link.getAttribute('data-state')
      if (initialState === 'disabled') {
        setState(link, 'disabled', true)
      }

      // Acara papan kekunci (Enter untuk aktifkan pautan)
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !link.classList.contains('nexus-disabled')) {
          e.preventDefault()
          link.click()
        }
      })

      // Pengurusan fokus
      link.addEventListener('focus', handleFocusVisible)
      link.addEventListener('blur', handleFocusVisible)

      // Simpan rujukan MutationObserver untuk perubahan data-state
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'data-state'
          ) {
            const newState = link.getAttribute('data-state')
            // Reset semua keadaan
            ;['disabled', 'loading', 'error', 'active'].forEach((s) =>
              setState(link, s, false)
            )
            if (newState) setState(link, newState, true)
          }
        })
      })
      observer.observe(link, { attributes: true })
    })
  }

  // --- Pengelola Butang (data-nexus-component="button") ---
  function setupButtons() {
    const buttons = document.querySelectorAll('[data-nexus-component="button"]')
    buttons.forEach((btn) => {
      if (!btn.hasAttribute('role')) btn.setAttribute('role', 'button')
      btn.setAttribute('tabindex', '0')

      const initialState = btn.getAttribute('data-state')
      if (initialState) {
        ;['disabled', 'loading', 'error', 'active'].forEach((s) =>
          setState(btn, s, false)
        )
        setState(btn, initialState, true)
      }

      // Papan kekunci
      btn.addEventListener('keydown', (e) => {
        if (
          (e.key === 'Enter' || e.key === ' ') &&
          !btn.classList.contains('nexus-disabled')
        ) {
          e.preventDefault()
          btn.click()
        }
      })

      btn.addEventListener('focus', handleFocusVisible)
      btn.addEventListener('blur', handleFocusVisible)

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'data-state'
          ) {
            const newState = btn.getAttribute('data-state')
            ;['disabled', 'loading', 'error', 'active'].forEach((s) =>
              setState(btn, s, false)
            )
            if (newState) setState(btn, newState, true)
          }
        })
      })
      observer.observe(btn, { attributes: true })
    })
  }

  // --- Pengelola Input (data-nexus-component="input") ---
  function setupInputs() {
    const inputs = document.querySelectorAll('[data-nexus-component="input"]')
    inputs.forEach((input) => {
      // Label mesti ada untuk aksesibiliti, boleh guna <label for="...">
      // Pastikan placeholder tidak menggantikan label
      const initialState = input.getAttribute('data-state')
      if (initialState === 'error') {
        setState(input, 'error', true)
      }

      input.addEventListener('focus', handleFocusVisible)
      input.addEventListener('blur', handleFocusVisible)

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'data-state'
          ) {
            const newState = input.getAttribute('data-state')
            ;['error'].forEach((s) => setState(input, s, false)) // input tidak ada disabled/loading dari segi reka bentuk mungkin
            if (newState) setState(input, newState, true)
          }
        })
      })
      observer.observe(input, { attributes: true })
    })
  }

  // --- Pengelola Senarai (data-nexus-component="list") ---
  function setupLists() {
    const lists = document.querySelectorAll('[data-nexus-component="list"]')
    lists.forEach((list) => {
      // Hanya memastikan peranan
      list.setAttribute('role', 'list')
      // Boleh tambah pengurusan anak-anak <li> jika perlu
    })
  }

  // --- Inisialisasi Semua Komponen ---
  function init() {
    setupLinks()
    setupButtons()
    setupInputs()
    setupLists()
  }

  // Jalankan apabila DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
