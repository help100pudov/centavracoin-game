import { createI18n } from "vue-i18n";

// Импортируем файлы с переводами
// import en from "../lang/en.json";
import ru from "../lang/ru.json";
import uk from "../lang/uk.json";
import ar from "../lang/ar.json";
import de from "../lang/de.json";
import es from "../lang/es.json";
import fr from "../lang/fr.json";
import it from "../lang/it.json";
import ko from "../lang/ko.json";
import zh from "../lang/zh.json";
import hi from "../lang/hi.json";
import vi from "../lang/vi.json";
import ja from "../lang/ja.json";
import el from "../lang/el.json";
import bg from "../lang/bg.json";
import ro from "../lang/ro.json";
import sk from "../lang/sk.json";
import cs from "../lang/cs.json";
import no from "../lang/no.json";
import fi from "../lang/fi.json";
import sv from "../lang/sv.json";
import nl from "../lang/nl.json";
import tr from "../lang/tr.json";
import pl from "../lang/pl.json";
import fa from "../lang/fa.json";
import pt from "../lang/pt.json";
import hu from "../lang/hu.json";
import bn from "../lang/bn.json";
import he from "../lang/he.json";
import hr from "../lang/hr.json";
import hy from "../lang/hy.json";
import ka from "../lang/ka.json";
import ms from "../lang/ms.json";
import sl from "../lang/sl.json";
import sr from "../lang/sr.json";
import sw from "../lang/sw.json";
import th from "../lang/th.json";
import tl from "../lang/tl.json";
import ur from "../lang/ur.json";
import am from "../lang/am.json";
import en from "../lang/en.json";

const lang = "en";
const messages = { ru, uk, ar, de, es, fr, it, ko, zh, hi, vi, ja, el, bg, ro, sk, cs, no, fi, sv, nl, tr, pl, fa, pt, hu, bn, he, hr, hy, ka, ms, sl, sr, sw, th, tl, ur, am, en };

const i18n = createI18n({
  locale: lang,
  fallbackRoot: true,
  fallbackLocale: "en",
  silentFallbackWarn: true,
  messages,
});

export default i18n; // Экспортируем экземпляр i18n
