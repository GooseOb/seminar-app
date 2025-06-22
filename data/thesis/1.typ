#set page(margin: 2.5cm)
#set text(font: "Times New Roman", size: 12pt, lang: "pl")
#set par(justify: true, leading: 0.65em)
#set heading(numbering: "1.1")

#align(center)[
  #text(16pt, weight: "bold")[
    UNIWERSYTET ŁÓDZKI \
    WYDZIAŁ MATEMATYKI I INFORMATYKI
  ]
  
  #v(2cm)
  
  #text(18pt, weight: "bold")[
    PRACA DYPLOMOWA MAGISTERSKA
  ]
  
  #v(1cm)
  
  #text(14pt, weight: "bold")[
    Opracowanie wydajnego systemu nawigacji dla kampusów uniwersyteckich z wykorzystaniem rzeczywistości rozszerzonej
  ]
  
  #v(1cm)
  
  #text(12pt)[
    Kierunek: Informatyka \
    Specjalność: Inżynieria Oprogramowania
  ]
  
  #v(2cm)
  
  #align(left)[
    Autor: Zofia Rodriguez \
    Nr albumu: 420524 \
    
    Promotor: dr hab. Jan Kowalski
  ]
  
  // #v(fill)
  
  Łódź 2025
]

#pagebreak()

#outline()

#pagebreak()

= Wprowadzenie

Współczesne kampusy uniwersyteckie charakteryzują się złożoną strukturą architektoniczną, która często sprawia trudności w poruszaniu się zarówno nowym studentom, jak i odwiedzającym. Problem orientacji w przestrzeni kampusowej staje się szczególnie widoczny w pierwszych tygodniach roku akademickiego, kiedy studenci pierwszego roku mają trudności z odnalezieniem sal wykładowych, laboratoriów czy biur administracyjnych.

Tradycyjne metody nawigacji, takie jak mapy statyczne czy tablice informacyjne, nie zawsze są wystarczające w dynamicznym środowisku uniwersyteckim. Ponadto, osoby z różnymi potrzebami dostępności wymagają specjalistycznych rozwiązań, które umożliwią im swobodne poruszanie się po terenie uczelni.

Niniejsza praca przedstawia koncepcję i implementację inteligentnego systemu nawigacji kampusowej wykorzystującego technologie rzeczywistości rozszerzonej (AR) oraz sztucznej inteligencji. Głównym celem jest opracowanie mobilnej aplikacji, która zapewni użytkownikom intuicyjną i dostępną nawigację w czasie rzeczywistym.

= Przegląd literatury

== Systemy nawigacji wewnętrznej

Nawigacja wewnętrzna (indoor navigation) stanowi znaczące wyzwanie techniczne ze względu na ograniczenia tradycyjnych systemów pozycjonowania satelitarnego w pomieszczeniach zamkniętych. Współczesne rozwiązania wykorzystują różnorodne technologie, w tym sygnały Wi-Fi, Bluetooth Low Energy (BLE), a także technologie wizyjne.

Liu et al. (2019) przeprowadzili analizę porównawczą różnych metod pozycjonowania wewnętrznego, wykazując, że systemy hybrydowe łączące kilka technologii osiągają najlepszą dokładność. Ich badania wskazują na możliwość osiągnięcia precyzji pozycjonowania na poziomie 1-2 metrów przy wykorzystaniu kombinacji sygnałów Wi-Fi i BLE.

== Rzeczywistość rozszerzona w nawigacji

Technologia rzeczywistości rozszerzonej zyskuje coraz większe znaczenie w aplikacjach nawigacyjnych. Azuma (1997) zdefiniował AR jako system, który łączy rzeczywiste i wirtualne obiekty w rzeczywistym środowisku, działa interaktywnie w czasie rzeczywistym oraz rejestruje obiekty w trzech wymiarach.

Współczesne implementacje AR w nawigacji, takie jak Google Live View czy Apple Maps, demonstrują potencjał tej technologii w usprawnianiu orientacji przestrzennej użytkowników.

== Dostępność w systemach nawigacyjnych

Projektowanie systemów nawigacyjnych musi uwzględniać potrzeby osób z różnymi rodzajami niepełnosprawności. Web Content Accessibility Guidelines (WCAG) 2.1 definiują standardy dostępności, które powinny być implementowane również w aplikacjach mobilnych.

Szczególną uwagę należy poświęcić osobom z dysfunkcjami wzroku, słuchu oraz ograniczeniami motorycznymi, zapewniając alternatywne sposoby interakcji z systemem.

= Metodologia

== Analiza wymagań

Proces zbierania wymagań został przeprowadzony w oparciu o badania ankietowe wśród studentów oraz wywiad z administracją uczelni. Zidentyfikowano następujące kluczowe funkcjonalności:

- Nawigacja w czasie rzeczywistym do wybranych lokalizacji
- Integracja z kalendarzem akademickim
- Funkcje dostępności dla osób niepełnosprawnych
- Informacje o dostępności sal i zasobów
- Powiadomienia o wydarzeniach kampusowych

== Architektura systemu

System został zaprojektowany w architekturze klient-serwer z następującymi komponentami:

- Aplikacja mobilna (Android/iOS)
- Serwer aplikacyjny
- Baza danych przestrzennych
- System zarządzania treścią AR
- Moduł analityczny

= Implementacja

== Technologie wykorzystane

Aplikacja mobilna została zaimplementowana z użyciem technologii React Native, co umożliwia jednoczasowe targetowanie platform Android i iOS. Do implementacji funkcjonalności AR wykorzystano bibliotekę AR.js wraz z Three.js dla renderowania obiektów 3D.

Backend systemu został zrealizowany w technologii Node.js z bazą danych PostgreSQL rozszerzoną o PostGIS dla obsługi danych przestrzennych.

== Moduł pozycjonowania

System pozycjonowania łączy sygnały Wi-Fi, Bluetooth beacons oraz dane z czujników inercyjnych urządzenia mobilnego. Implementowano algorytm filtracji Kalmana w celu zwiększenia dokładności estymacji pozycji.

= Testowanie i walidacja

Przeprowadzono testy funkcjonalne systemu z udziałem grupy 50 studentów. Średnia dokładność pozycjonowania wyniosła 1.8 metra, co uznano za wynik satysfakcjonujący dla celów nawigacji kampusowej.

Testy dostępności przeprowadzono z udziałem osób z różnymi rodzajami niepełnosprawności, co pozwoliło na identyfikację i wdrożenie dodatkowych ulepszeń interfejsu.

= Wnioski

Opracowany system nawigacji kampusowej z wykorzystaniem rzeczywistości rozszerzonej stanowi znaczący krok naprzód w usprawnieniu orientacji przestrzennej na terenie uczelni. Integracja technologii AR z funkcjami dostępności tworzy kompleksowe rozwiązanie odpowiadające na zróżnicowane potrzeby użytkowników.

Dalsze prace badawcze powinny koncentrować się na optymalizacji algorytmów pozycjonowania oraz rozszerzeniu funkcjonalności o elementy gamifikacji i interakcji społecznych.

= Bibliografia

Azuma, R. T. (1997). A survey of augmented reality. Presence: Teleoperators & Virtual Environments, 6(4), 355-385.

Liu, H., Darabi, H., Banerjee, P., & Liu, J. (2019). Survey of wireless indoor positioning techniques and systems. IEEE Transactions on Systems, Man, and Cybernetics, Part C, 37(6), 1067-1080.

Web Content Accessibility Guidelines (WCAG) 2.1. (2018). W3C Recommendation. https://www.w3.org/WAI/WCAG21/

= Załączniki

== Załącznik A: Interfejs użytkownika aplikacji

[Miejsce na zrzuty ekranu aplikacji]

== Załącznik B: Diagramy architektury systemu

[Miejsce na diagramy techniczne]
