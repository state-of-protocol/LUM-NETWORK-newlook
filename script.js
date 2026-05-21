/**
 * Nexus Design System – Interaction Layer (Production‑Ready)
 * Mematuhi WCAG 2.2 AA.
 * CSS token (theme.css/style.css) mesti dimuatkan terlebih dahulu.
 *
 * Gunakan data-nexus-component="link|button|input|list" pada elemen.
 * Keadaan (state) boleh diubah dengan data-state="disabled|loading|error|active".
 * Elemen yang ditambah secara dinamik selepas pemuatan awal akan dikendalikan
 * secara automatik.
 */
;(function () {
  'use strict'

  // --- Fungsi Utiliti ---

  /**
   * Tambah / buang kelas CSS dan atribut ARIA berdasarkan keadaan.
   * @param {HTMLElement} el
   * @param {string} state - 'disabled' | 'loading' | 'error' | 'active'
   * @param {boolean} on - true untuk aktifkan, false untuk nyahaktif
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
   * Mengendalikan penunjuk fokus yang kelihatan untuk navigasi papan kekunci.
   * Menambah kelas 'nexus-focus-visible' pada fokus (bukan dari tetikus).
   */
  function handleFocusVisible(event) {
    const el = event.target
    if (event.type === 'focus') {
      el.classList.add('nexus-focus-visible')
    } else if (event.type === 'blur') {
      el.classList.remove('nexus-focus-visible')
    }
  }

  /**
   * Sediakan MutationObserver untuk memantau perubahan atribut data-state.
   * @param {HTMLElement} el
   * @param {string[]} possibleStates - senarai keadaan yang mungkin untuk komponen ini
   */
  function observeStateChanges(el, possibleStates) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-state'
        ) {
          const newState = el.getAttribute('data-state')
          // Reset semua keadaan dahulu
          possibleStates.forEach((s) => setState(el, s, false))
          if (newState) setState(el, newState, true)
        }
      })
    })
    observer.observe(el, { attributes: true })
  }

  // --- Persediaan Setiap Jenis Komponen ---

  /**
   * Sediakan satu elemen pautan (link).
   */
  function setupLink(link) {
    if (link.dataset.nexusInit === 'true') return // elakkan inisialisasi berganda
    link.dataset.nexusInit = 'true'

    if (!link.hasAttribute('href')) link.setAttribute('href', '#')
    link.setAttribute('role', 'link')
    link.setAttribute('tabindex', '0')

    const initialState = link.getAttribute('data-state')
    if (initialState === 'disabled') {
      setState(link, 'disabled', true)
    }

    // Papan kekunci: Enter untuk mengklik pautan
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !link.classList.contains('nexus-disabled')) {
        e.preventDefault()
        link.click()
      }
    })

    link.addEventListener('focus', handleFocusVisible)
    link.addEventListener('blur', handleFocusVisible)

    observeStateChanges(link, ['disabled', 'loading', 'error', 'active'])
  }

  /**
   * Sediakan satu elemen butang (button).
   */
  function setupButton(btn) {
    if (btn.dataset.nexusInit === 'true') return
    btn.dataset.nexusInit = 'true'

    if (!btn.hasAttribute('role')) btn.setAttribute('role', 'button')
    btn.setAttribute('tabindex', '0')

    const initialState = btn.getAttribute('data-state')
    if (initialState) {
      ;['disabled', 'loading', 'error', 'active'].forEach((s) =>
        setState(btn, s, false)
      )
      setState(btn, initialState, true)
    }

    // Papan kekunci: Enter atau Space
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

    observeStateChanges(btn, ['disabled', 'loading', 'error', 'active'])
  }

  /**
   * Sediakan satu elemen input.
   */
  function setupInput(input) {
    if (input.dataset.nexusInit === 'true') return
    input.dataset.nexusInit = 'true'

    const initialState = input.getAttribute('data-state')
    if (initialState === 'error') {
      setState(input, 'error', true)
    }

    // Pastikan label wujud (cari label dengan atribut for atau label induk)
    const label = document.querySelector(`label[for="${input.id}"]`)
    if (!label) {
      console.warn('Nexus: Input', input, 'tiada label yang dikaitkan. Sila tambah label untuk aksesibiliti.')
    }

    input.addEventListener('focus', handleFocusVisible)
    input.addEventListener('blur', handleFocusVisible)

    observeStateChanges(input, ['error', 'disabled'])
  }

  /**
   * Sediakan satu elemen senarai (list).
   */
  function setupList(list) {
    if (list.dataset.nexusInit === 'true') return
    list.dataset.nexusInit = 'true'
    list.setAttribute('role', 'list')
  }

  /**
   * Cari dan sediakan semua komponen yang sepadan di dalam bekas (container) tertentu.
   * @param {HTMLElement} container
   */
  function setupComponentsInContainer(container) {
    container.querySelectorAll('[data-nexus-component="link"]').forEach(setupLink)
    container.querySelectorAll('[data-nexus-component="button"]').forEach(setupButton)
    container.querySelectorAll('[data-nexus-component="input"]').forEach(setupInput)
    container.querySelectorAll('[data-nexus-component="list"]').forEach(setupList)
  }

  // --- Inisialisasi Awal & Pemerhati untuk Elemen Dinamik ---

  function init() {
    // Sediakan semua komponen sedia ada di seluruh dokumen
    setupComponentsInContainer(document.body)

    // Pantau penambahan elemen secara dinamik dengan MutationObserver pada body
    const bodyObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Jika elemen yang ditambah itu sendiri komponen
              if (node.hasAttribute && node.hasAttribute('data-nexus-component')) {
                setupComponentByType(node)
              }
              // Periksa juga keturunannya untuk komponen baharu
              if (node.querySelectorAll) {
                setupComponentsInContainer(node)
              }
            }
          })
        }
      })
    })
    bodyObserver.observe(document.body, { childList: true, subtree: true })
  }

  /**
   * Sediakan satu elemen yang diketahui jenisnya berdasarkan atribut data-nexus-component.
   */
  function setupComponentByType(el) {
    const type = el.getAttribute('data-nexus-component')
    switch (type) {
      case 'link':
        setupLink(el)
        break
      case 'button':
        setupButton(el)
        break
      case 'input':
        setupInput(el)
        break
      case 'list':
        setupList(el)
        break
      default:
        break
    }
  }

  // Jalankan apabila DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
