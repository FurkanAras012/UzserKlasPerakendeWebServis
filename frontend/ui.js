// Arayüz yardımcıları
// Küçük toast bildirimleri için SweetAlert2 kullanıyoruz
export function showSuccess(msg) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: msg,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    // Hover ile süreyi durdurmak isterseniz:
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
}

export function showError(msg) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: msg,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
}

export function populateDropdown(items, dropdownId, formatFn, selectFn) {
  const dd = document.getElementById(dropdownId);
  if (!dd) return;           // Element yoksa hemen çık
  dd.innerHTML = '';         // Şimdi güvenle temizle

  items.forEach(item => {
    const li = document.createElement('li');
    li.classList.add('dropdown-item');
    li.textContent = formatFn(item);
    li.onclick = () => selectFn(item);
    dd.appendChild(li);
  });

  // İstersen otomatik açmak için:
  //dd.style.display = items.length ? 'block' : 'none';
}

export function toggleOrderInfo() {
  const body = document.getElementById('orderInfoBody');
  const icon = document.getElementById('toggleOrderInfoIcon');
  if (body.style.display === 'none' || !body.style.display) {
    body.style.display = 'block'; icon.classList.replace('bi-plus-lg','bi-dash-lg');
  } else {
    body.style.display = 'none'; icon.classList.replace('bi-dash-lg','bi-plus-lg');
  }
}

export function handleEnter(event, callback) {
  if (event.key === 'Enter') { event.preventDefault(); callback(); }
}