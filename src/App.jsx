import { useState, useEffect } from "react";
import "./App.css";

/* Kitap verileri (sabit dizi) */
const KITAPLAR = [
  { id: 1, baslik: "React’e Giriş", yazar: "D. Usta", kategori: "Web" },
  { id: 2, baslik: "İleri JavaScript", yazar: "S. Kılıç", kategori: "Web" },
  { id: 3, baslik: "Veri Yapıları", yazar: "A. Demir", kategori: "CS" },
  { id: 4, baslik: "Algoritmalar", yazar: "E. Kaya", kategori: "CS" },
  { id: 5, baslik: "UI/UX Temelleri", yazar: "N. Akın", kategori: "Tasarım" },
];

/* localStorage hook’u */
function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    const kayitli = localStorage.getItem(key);
    return kayitli ? JSON.parse(kayitli) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

/* Arama Çubuğu */
function AramaCubugu({ aramaMetni, onArama }) {
  return (
    <input
      type="text"
      placeholder="Başlık veya yazar ara..."
      value={aramaMetni}
      onChange={(e) => onArama(e.target.value)}
    />
  );
}

/* Kategori Filtresi */
function KategoriFiltre({ seciliKategori, onKategoriSec, kategoriler }) {
  return (
    <select
      value={seciliKategori}
      onChange={(e) => onKategoriSec(e.target.value)}
    >
      <option value="Tümü">Tümü</option>
      {kategoriler.map((kat) => (
        <option key={kat} value={kat}>
          {kat}
        </option>
      ))}
    </select>
  );
}

/* Kitap Kartı */
function KitapKarti({ id, baslik, yazar, kategori, favorideMi, onFavoriToggle }) {
  return (
    <div className="kitap-karti">
      <div className="kitap-bilgi">
        <strong>{baslik}</strong>
        <small>
          {yazar} · {kategori}
        </small>
      </div>
      <button
        onClick={() => onFavoriToggle(id)}
        className={favorideMi ? "favoride" : ""}
      >
        {favorideMi ? "★ Favoride" : "☆ Favori Ekle"}
      </button>
    </div>
  );
}

/* Kitap Listesi */
function KitapListe({ kitaplar, favoriler, onFavoriToggle }) {
  return (
    <div>
      {kitaplar.map((kitap) => (
        <KitapKarti
          key={kitap.id}
          {...kitap}
          favorideMi={favoriler.includes(kitap.id)}
          onFavoriToggle={onFavoriToggle}
        />
      ))}
    </div>
  );
}

/* Favori Paneli */
function FavoriPaneli({ favoriler, kitaplar, onFavoriKaldir }) {
  const favoriKitaplar = kitaplar.filter((k) => favoriler.includes(k.id));

  return (
    <div className="favoriler-paneli">
      <h3>Favoriler ({favoriKitaplar.length})</h3>
      <ul>
        {favoriKitaplar.map((kitap) => (
          <li key={kitap.id}>
            <span>{kitap.baslik}</span>
            <button onClick={() => onFavoriKaldir(kitap.id)}>Kaldır</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* === Ana Bileşen === */
export default function App() {
  const [aramaMetni, setAramaMetni] = useLocalStorageState("aramaMetni", "");
  const [seciliKategori, setSeciliKategori] = useState("Tümü");
  const [favoriler, setFavoriler] = useLocalStorageState("favoriler", []);

  const kategoriler = [...new Set(KITAPLAR.map((k) => k.kategori))];

  const filtrelenmis = KITAPLAR.filter((k) => {
    const metin = aramaMetni.toLowerCase("tr");
    const aramaEslesti =
      k.baslik.toLowerCase("tr").includes(metin) ||
      k.yazar.toLowerCase("tr").includes(metin);
    const kategoriEslesti =
      seciliKategori === "Tümü" || k.kategori === seciliKategori;
    return aramaEslesti && kategoriEslesti;
  });

  const favoriToggle = (id) => {
    setFavoriler((eski) =>
      eski.includes(id) ? eski.filter((f) => f !== id) : [...eski, id]
    );
  };

  const favoriKaldir = (id) => {
    setFavoriler((eski) => eski.filter((f) => f !== id));
  };

  return (
    <div className="app">
      <div className="kitaplar">
        <h1>Mini Kitaplık</h1>

        <div className="filtreler">
          <AramaCubugu aramaMetni={aramaMetni} onArama={setAramaMetni} />
          <KategoriFiltre
            seciliKategori={seciliKategori}
            onKategoriSec={setSeciliKategori}
            kategoriler={kategoriler}
          />
        </div>

        <KitapListe
          kitaplar={filtrelenmis}
          favoriler={favoriler}
          onFavoriToggle={favoriToggle}
        />
      </div>

      <FavoriPaneli
        favoriler={favoriler}
        kitaplar={KITAPLAR}
        onFavoriKaldir={favoriKaldir}
      />
    </div>
  );
}
