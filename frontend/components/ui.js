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

export function populateDropdown(items, dropdownId, formatFn, selectFn, detailFn) {
  const dd = document.getElementById(dropdownId);
  if (!dd) return;           // Element yoksa hemen çık
  dd.innerHTML = '';         // Şimdi güvenle temizle
  
  // Dropdown container'a agresif stil ekle
  dd.style.maxHeight = '250px';  // Yaklaşık 10 item yüksekliği (10 x 48px + padding)
  dd.style.height = 'auto';
  dd.style.minHeight = 'auto';
  dd.style.overflowY = 'auto';
  dd.style.overflowX = 'hidden';
  dd.style.padding = '0';
  dd.style.margin = '0';
  dd.style.position = 'absolute';
  dd.style.top = '100%';
  dd.style.left = '0';
  dd.style.right = '0';
  dd.style.width = '100%';
  dd.style.maxWidth = '100%';
  dd.style.zIndex = '1050';
  dd.style.backgroundColor = 'white';
  dd.style.border = '1px solid #e0e0e0';
  dd.style.borderRadius = '8px';
  dd.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  dd.style.bottom = 'auto';
  dd.style.transform = 'none';
  dd.style.inset = 'auto';

  console.log(`📋 ${dropdownId} dropdown dolduruluyor, ${items.length} öğe`);

  items.forEach(item => {
    const li = document.createElement('li');
    li.classList.add('dropdown-item');
    
    // Inline stil ile boyutları büyült
    li.style.cursor = 'pointer';
    li.style.userSelect = 'none';
    li.style.position = 'relative';
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    li.style.padding = '0.75rem 1rem';
    li.style.fontSize = '1rem';
    li.style.lineHeight = '1.4';
    li.style.borderBottom = '1px solid #f0f0f0';
    li.style.minHeight = '48px';
    li.style.maxHeight = '48px';
    li.style.height = '48px';
    li.style.margin = '0';
    li.style.whiteSpace = 'nowrap';
    li.style.overflow = 'hidden';
    li.style.textOverflow = 'ellipsis';
    li.style.fontWeight = '500';
    li.style.color = '#333';
    li.style.backgroundColor = '#fff';
    li.style.transition = 'all 0.2s ease';
    
    // Ana içerik
    const span = document.createElement('span');
    span.textContent = formatFn(item);
    span.style.flex = '1';
    span.style.fontSize = '1rem';
    span.style.lineHeight = '1.4';
    span.style.overflow = 'hidden';
    span.style.textOverflow = 'ellipsis';
    span.style.whiteSpace = 'nowrap';
    span.style.fontWeight = '500';
    span.style.color = '#333';
    
    li.appendChild(span);
    
    // Detay fonksiyonu varsa detay butonu ekle
    if (detailFn) {
      const detailBtn = document.createElement('button');
      detailBtn.classList.add('btn', 'btn-sm', 'btn-outline-info');
      detailBtn.innerHTML = '<i class="bi bi-eye"></i>';
      detailBtn.style.opacity = '0';
      detailBtn.style.transition = 'all 0.2s ease';
      detailBtn.style.marginLeft = '8px';
      detailBtn.style.padding = '0.25rem 0.375rem';
      detailBtn.style.fontSize = '0.75rem';
      detailBtn.style.lineHeight = '1.2';
      detailBtn.style.height = '30px';
      detailBtn.style.width = '30px';
      detailBtn.style.borderRadius = '4px';
      detailBtn.style.backgroundColor = '#fff';
      detailBtn.style.color = '#6c757d';
      detailBtn.style.border = '1px solid #6c757d';
      detailBtn.style.display = 'flex';
      detailBtn.style.alignItems = 'center';
      detailBtn.style.justifyContent = 'center';
      detailBtn.title = 'Detayları Görüntüle';
      
      // Detay butonu tıklama
      detailBtn.addEventListener('click', (e) => {
        console.log('👁️ Detay butonu tıklandı:', item);
        e.preventDefault();
        e.stopPropagation();
        detailFn(item);
      });
      
      // Butonu mouse event'lerinden koruyalım
      detailBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      
      // Hover efektleri
      li.addEventListener('mouseenter', () => {
        detailBtn.style.opacity = '1';
        detailBtn.style.backgroundColor = '#0d6efd';
        detailBtn.style.color = '#fff';
        detailBtn.style.borderColor = '#0d6efd';
        detailBtn.style.transform = 'scale(1.05)';
        li.style.backgroundColor = '#f8f9fa';
        li.style.color = '#0d6efd';
        li.style.transform = 'translateX(2px)';
        li.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      });
      
      li.addEventListener('mouseleave', () => {
        detailBtn.style.opacity = '0';
        detailBtn.style.backgroundColor = '#fff';
        detailBtn.style.color = '#6c757d';
        detailBtn.style.borderColor = '#6c757d';
        detailBtn.style.transform = 'scale(1)';
        li.style.backgroundColor = '#fff';
        li.style.color = '#333';
        li.style.transform = 'translateX(0)';
        li.style.boxShadow = 'none';
      });
      
      li.appendChild(detailBtn);
    } else {
      // Detay butonu yoksa da hover efektleri ekleyelim
      li.addEventListener('mouseenter', () => {
        li.style.backgroundColor = '#f8f9fa';
        li.style.color = '#0d6efd';
        li.style.transform = 'translateX(2px)';
        li.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      });
      
      li.addEventListener('mouseleave', () => {
        li.style.backgroundColor = '#fff';
        li.style.color = '#333';
        li.style.transform = 'translateX(0)';
        li.style.boxShadow = 'none';
      });
    }
    
    // Mouse event'lerini düzelt
    li.addEventListener('mousedown', (e) => {
      // Detay butonuna tıklanmışsa işlem yapma
      if (e.target.closest('button')) {
        return;
      }
      // preventDefault kaldırıldı - bu dropdown'ların kapanmasına sebep oluyordu
      console.log('🖱️ Dropdown item mousedown');
    });
    
    // Ana öğe tıklama - seçim
    li.addEventListener('click', (e) => {
      // Detay butonuna tıklanmışsa işlem yapma
      if (e.target.closest('button')) {
        return;
      }
      
      console.log('👆 Tek tıklama - seçim:', item);
      selectFn(item);
    });
    
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