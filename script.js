// Список всех 90 серверов
const serverNames = {
  1: "RED", 2: "GREEN", 3: "BLUE", 4: "YELLOW", 5: "ORANGE", 6: "PURPLE", 
  7: "LIME", 8: "PINK", 9: "CHERRY", 10: "BLACK", 11: "INDIGO", 12: "WHITE", 
  13: "MAGENTA", 14: "CRIMSON", 15: "GOLD", 16: "AZURE", 17: "PLATINUM", 18: "AQUA", 
  19: "GRAY", 20: "ICE", 21: "CHILLI", 22: "CHOCO", 23: "MOSCOW", 24: "SPB", 
  25: "UFA", 26: "SOCHI", 27: "KAZAN", 28: "SAMARA", 29: "ROSTOV", 30: "ANAPA", 
  31: "EKB", 32: "KRASNODAR", 33: "ARZAMAS", 34: "NOVOSIBIRSK", 35: "GROZNY", 36: "SARATOV", 
  37: "OMSK", 38: "IRKUTSK", 39: "VOLGOGRAD", 40: "VORONEZH", 41: "BELGOROD", 42: "MAKHACHKALA", 
  43: "VLADIKAVKAZ", 44: "VLADIVOSTOK", 45: "KALININGRAD", 46: "CHELYABINSK", 47: "KRASNOYARSK", 
  48: "CHEBOKSARY", 49: "KHABAROVSK", 50: "PERM", 51: "TULA", 52: "RYAZAN", 53: "MURMANSK", 
  54: "PENZA", 55: "KURSK", 56: "ARKHANGELSK", 57: "ORENBURG", 58: "KIROV", 59: "KEMEROVO", 
  60: "TYUMEN", 61: "TOLYATTI", 62: "IVANOVO", 63: "STAVROPOL", 64: "SMOLENSK", 65: "PSKOV", 
  66: "BRYANSK", 67: "OREL", 68: "YAROSLAVL", 69: "BARNAUL", 70: "LIPETSK", 71: "ULYANOVSK", 
  72: "YAKUTSK", 73: "TAMBOV", 74: "BRATSK", 75: "ASTRAKHAN", 76: "CHITA", 77: "KOSTROMA", 
  78: "VLADIMIR", 79: "KALUGA", 80: "NOVGOROD", 81: "TAGANROG", 82: "VOLOGDA", 83: "TVER", 
  84: "TOMSK", 85: "IZHEVSK", 86: "SURGUT", 87: "PODOLSK", 88: "MAGADAN", 89: "CHEREPOVETS", 
  90: "NORILSK"
};

const servers = [];
for (let i = 1; i <= 90; i++) {
  const num = i < 10 ? `0${i}` : `${i}`;
  servers.push(`${serverNames[i]} (${num})`);
}

// Курсы конвертации цен (Базовая цена указана в сомах KGS)
const currencyRates = {
  KGS: { rate: 1, symbol: 'сом' },
  RUB: { rate: 0.95, symbol: '₽' },
  USD: { rate: 0.011, symbol: '$' },
  KZT: { rate: 5.6, symbol: '₸' }
};

// Переводы категорий
const catLabels = {
  ru: { virts: 'Вирты', account: 'Аккаунт', property: 'Имущество', buy: 'Купить' },
  en: { virts: 'Virts', account: 'Account', property: 'Property', buy: 'Buy' }
};

// Базовые лоты (цены в KGS)
const lots = [
  { id: 1, server: 'RED (01)', category: 'virts', title: 'Продам 3.000.000 ИВ (быстро)', priceKGS: 300 },
  { id: 2, server: 'MOSCOW (23)', category: 'account', title: 'Аккаунт 18 левел + гараж', priceKGS: 1200 },
  { id: 3, server: 'SAMARA (28)', category: 'property', title: 'BMW M5 F90 FT ST2', priceKGS: 850 },
  { id: 4, server: 'NORILSK (90)', category: 'virts', title: '5.000.000 ИВ в наличии', priceKGS: 500 }
];

const container = document.getElementById('marketGrid');
const filterServer = document.getElementById('filterServer');
const filterCategory = document.getElementById('filterCategory');
const langSelect = document.getElementById('langSelect');
const currencySelect = document.getElementById('currencySelect');

// Заполнение серверов
function initServers() {
  const isEn = langSelect.value === 'en';
  filterServer.innerHTML = `<option value="all">${isEn ? 'All servers (1-90)' : 'Все сервера (1–90)'}</option>`;
  servers.forEach(s => {
    filterServer.innerHTML += `<option value="${s}">${s}</option>`;
  });
}

// Отрисовка товаров
function renderLots() {
  const selectedServer = filterServer.value;
  const selectedCategory = filterCategory.value;
  const lang = langSelect.value;
  const curr = currencySelect.value;
  
  const { rate, symbol } = currencyRates[curr];

  const filtered = lots.filter(item => {
    const matchServer = selectedServer === 'all' || item.server === selectedServer;
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchServer && matchCat;
  });

  container.innerHTML = '';
  
  if (filtered.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #8f94b2;">${lang === 'en' ? 'Nothing found' : 'Ничего не найдено'}</p>`;
    return;
  }

  filtered.forEach(lot => {
    const convertedPrice = Math.round(lot.priceKGS * rate);
    const catClass = lot.category === 'account' ? 'cat-account' : (lot.category === 'property' ? 'cat-property' : 'cat-virts');
    const catText = catLabels[lang][lot.category];
    const buyBtnText = catLabels[lang].buy;

    container.innerHTML += `
      <div class="card">
        <div>
          <span class="server-badge">📍 ${lot.server}</span>
          <span class="category-badge ${catClass}">${catText}</span>
          <div class="card-title">${lot.title}</div>
        </div>
        <div class="card-footer">
          <div class="card-price">${convertedPrice} ${symbol}</div>
          <button class="btn-buy" onclick="alert('${lang === 'en' ? 'Auth required' : 'Требуется авторизация'}')">${buyBtnText}</button>
        </div>
      </div>
    `;
  });
}

// Смена языка интерфейса
function updateLanguage() {
  const lang = langSelect.value;
  
  // Обновляем тексты в кнопках и лейблах с атрибутами data-ru и data-en
  document.querySelectorAll('[data-ru]').forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });

  initServers();
  renderLots();
}

// Обработчики входа/регистрации
document.getElementById('loginBtn').onclick = () => {
  const isEn = langSelect.value === 'en';
  alert(isEn ? "Login modal window" : "Окно входа на сайт");
};

document.getElementById('registerBtn').onclick = () => {
  const isEn = langSelect.value === 'en';
  alert(isEn ? "Registration modal window" : "Окно регистрации");
};

// События
filterServer.onchange = renderLots;
filterCategory.onchange = renderLots;
currencySelect.onchange = renderLots;
langSelect.onchange = updateLanguage;

// Инициализация
initServers();
renderLots();