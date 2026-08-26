import { Check, Languages } from "lucide-react"

import type { Translation } from "@/lib/dictionaries"
import { LOCALES, LOCALE_META } from "@/lib/i18n"

interface LanguageSwitcherProps {
  translation: Translation
}

/**
 * The explicit override for the language the middleware guessed.
 *
 * A `<details>` disclosure holding seven plain `<a>` links, so it is a server
 * component and keeps working with JavaScript switched off — the same bar the
 * rest of the page clears. The links are the whole mechanism: each locale is a
 * real URL, and the middleware remembers the one that was opened (see
 * middleware.ts), so the choice survives the next visit without this component
 * needing to run any code.
 *
 * The trade for staying scriptless is that the panel closes on a second tap of
 * the summary rather than on an outside click. For a control most visitors use
 * once, that is the right side of the trade.
 */
export function LanguageSwitcher({ translation }: LanguageSwitcherProps) {
  const { locale, t } = translation

  return (
    <details className="relative ml-auto shrink-0">
      <summary
        // `list-none` plus the WebKit pseudo-element removes the disclosure
        // triangle in every engine; `cursor-default` because this reads as a
        // button, not as text.
        className="flex min-h-11 cursor-default list-none items-center gap-1.5 rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden"
        aria-label={t.language.label}
      >
        <Languages className="h-5 w-5" aria-hidden="true" />
        <span aria-hidden="true">{locale.toUpperCase()}</span>
      </summary>

      {/* right-0 so the panel opens inwards from the header's right edge and
          never pushes the page wide enough to scroll sideways on a phone.
          The height cap matters because the panel is positioned out of flow:
          nine 44px rows are taller than a phone held sideways, and the
          document would not grow to let anyone scroll down to the last of
          them. Capped, it scrolls itself instead. */}
      <ul className="absolute right-0 z-20 mt-1 max-h-[70vh] min-w-44 overflow-y-auto overscroll-contain rounded-md border bg-card py-1 shadow-lg">
        {LOCALES.map((option) => {
          const isCurrent = option === locale

          return (
            <li key={option}>
              <a
                href={`/${option}`}
                // Both the language tag and `lang` come from `htmlLang`, so
                // this agrees with the hreflang alternates in the head - the
                // route segment is `/no`, but the language is `nb`.
                hrefLang={LOCALE_META[option].htmlLang}
                lang={LOCALE_META[option].htmlLang}
                // aria-current marks the active language for screen readers;
                // the check mark is the same fact for everyone else.
                aria-current={isCurrent ? "true" : undefined}
                className={`flex min-h-11 items-center justify-between gap-3 px-3 text-[15px] transition-colors hover:bg-muted ${
                  isCurrent ? "font-semibold" : ""
                }`}
              >
                {LOCALE_META[option].label}
                {isCurrent && (
                  <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                )}
              </a>
            </li>
          )
        })}
      </ul>
    </details>
  )
}
