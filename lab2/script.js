"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const formularz = document.getElementById('formularz-zadan');
    const wejscie = document.getElementById('wejscie-zadania');
    const listaWyboru = document.getElementById('wybor-listy');
    const formularzListy = document.getElementById('formularz-listy');
    const wejscieListy = document.getElementById('wejscie-listy');
    const kontenerList = document.getElementById('kontener-list');
    const modal = document.getElementById('modal');
    const tekstModala = document.getElementById('tekst-modala');
    const potwierdzUsuniecie = document.getElementById('potwierdz-usuniecie');
    const anulujUsuniecie = document.getElementById('anuluj-usuniecie');
    const wejscieSzukania = document.getElementById('wejscie-szukania');
    const przelacznikWielkosciLiter = document.getElementById('przelacznik-wielkosci-liter');

    let ostatnioUsuniety = null;

    console.log("Form element:", formularz);
    console.log("Input element:", wejscie);
    console.log("List select element:", listaWyboru);
    console.log("Lists container element:", kontenerList);
    console.log("Modal element:", modal);

    function dodajZadanie(tekst, idListy) {
        console.log("Dodawanie zadania:", tekst);

        const sekcjaListy = document.querySelector(`.sekcja-listy-zadan[data-list-id="${idListy}"]`);
        if (!sekcjaListy) return;

        const listaZadan = sekcjaListy.querySelector('.lista-zadan');
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="tresc-zadania">
                <span class="tekst-zadania">${tekst}</span>
                <span class="data-zadania"></span>
            </div>
            <button class="przycisk-usun">X</button>
        `;

        const trescZadania = li.querySelector('.tresc-zadania');
        trescZadania.addEventListener('click', () => {
            console.log("Oznaczenie zadania jako wykonane/niewykonane");
            li.classList.toggle('wykonane');
            const dataCzas = li.querySelector('.data-zadania');
            const tekstZadania = li.querySelector('.tekst-zadania');

            if (li.classList.contains('wykonane')) {
            const teraz = new Date();
            dataCzas.textContent = `(Wykonano: ${teraz.toLocaleDateString()} ${teraz.toLocaleTimeString()})`;
            tekstZadania.style.textDecoration = 'line-through';
            tekstZadania.style.color = 'gray';
            } else {
            dataCzas.textContent = '';
            tekstZadania.style.textDecoration = 'none';
            tekstZadania.style.color = '';
            }
        });

        const przyciskUsun = li.querySelector('.przycisk-usun');
        przyciskUsun.addEventListener('click', () => {
            console.log("Próba usunięcia zadania");
            tekstModala.textContent = `Czy na pewno chcesz usunąć zadanie o treści: "${tekst}"?`;
            modal.classList.remove('ukryty');

            potwierdzUsuniecie.onclick = () => {
                console.log("Potwierdzono usunięcie zadania");
                ostatnioUsuniety = {
                    element: li,
                    parent: listaZadan
                };
                li.remove();
                modal.classList.add('ukryty');
            };

            anulujUsuniecie.onclick = () => {
                console.log("Anulowano usunięcie zadania");
                modal.classList.add('ukryty');
            };
        });

        listaZadan.appendChild(li);
        console.log("Zadanie dodane do listy");
    }

    function utworzNowaListe(nazwaListy) {
        const idListy = nazwaListy.toLowerCase().replace(/\s+/g, '-');
        if (document.querySelector(`.sekcja-listy-zadan[data-list-id="${idListy}"]`)) {
            alert('Lista o takiej nazwie już istnieje!');
            return false;
        }

        const sekcjaListy = document.createElement('div');
        sekcjaListy.className = 'sekcja-listy-zadan';
        sekcjaListy.setAttribute('data-list-id', idListy);
        sekcjaListy.innerHTML = `
            <h3 class="naglowek-listy">${nazwaListy} <span class="ikona-zwijania">▼</span></h3>
            <ul class="lista-zadan"></ul>
        `;
        sekcjaListy.querySelector('.naglowek-listy').addEventListener('click', () => {
            sekcjaListy.classList.toggle('zwiniety');
        });

        kontenerList.appendChild(sekcjaListy);

        const opcja = document.createElement('option');
        opcja.value = idListy;
        opcja.textContent = nazwaListy;
        listaWyboru.appendChild(opcja);

        return true;
    }

    function filtrujZadania() {
        const zapytanie = wejscieSzukania.value;
        const rozrozniajLitery = przelacznikWielkosciLiter.checked;

        document.querySelectorAll('.sekcja-listy-zadan').forEach(sekcja => {
            const zadania = sekcja.querySelectorAll('li');
            zadania.forEach(zadanie => {
                const tekstZadania = zadanie.querySelector('.tekst-zadania').textContent;
                const pasuje = rozrozniajLitery
                    ? tekstZadania.includes(zapytanie)
                    : tekstZadania.toLowerCase().includes(zapytanie.toLowerCase());

                zadanie.style.display = pasuje ? 'flex' : 'none';
            });
        });
    }

    dodajZadanie("Skończ zadanie na PIWo", "mało-pilne");
    dodajZadanie("Pokonaj rektora Politechniki w szachy", "mało-pilne");

    formularz.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log("Formularz wysłany");
        const tekstZadania = wejscie.value.trim();
        const wybranaLista = listaWyboru.value;

        if (tekstZadania) {
            dodajZadanie(tekstZadania, wybranaLista);
            wejscie.value = '';
        }
    });

    formularzListy.addEventListener('submit', (e) => {
        e.preventDefault();
        const nowaNazwaListy = wejscieListy.value.trim();
        if (nowaNazwaListy) {
            if (utworzNowaListe(nowaNazwaListy)) {
                wejscieListy.value = '';
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'z' && ostatnioUsuniety) {
            console.log("Przywracanie ostatnio usuniętego zadania");
            ostatnioUsuniety.parent.appendChild(ostatnioUsuniety.element);
            ostatnioUsuniety = null;
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            console.log("Zamykanie modalu (kliknięcie poza obszarem)");
            modal.classList.add('ukryty');
        }
    });

    document.querySelectorAll('.naglowek-listy').forEach(naglowek => {
        naglowek.addEventListener('click', () => {
            naglowek.parentElement.classList.toggle('zwiniety');
        });
    });

    wejscieSzukania.addEventListener('input', filtrujZadania);
    wejscieSzukania.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            filtrujZadania();
        }
    });
    przelacznikWielkosciLiter.addEventListener('change', filtrujZadania);
});
