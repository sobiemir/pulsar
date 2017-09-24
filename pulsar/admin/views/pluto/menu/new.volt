<div id="content" class="items-vertical lightgrey-back fill-free">

    {{ tag.form([
        'admin/menu',
        'id': 'menu-edit',
        'source': data
    ]) }}

        <div class="head-bar mb00">
            <h2 class="mb5">Nowe menu</h2>
            <p class="description">
                Utworzone menu będzie puste, dlatego warto od razu podpiąć
                do niego strony, artykuły lub przekierowania.
            </p>
        </div>

        {{ tag.tabControl([
            'index'   : 'default_name',
            'source'  : languages,
            'selected': language,
            'class'   : 'white-back head-bar',
            'data'    : [
                'searcher': '#menu-edit-container'
            ]
        ]) }}

        <table id="menu-edit-container" class="w100p form container">
            <!-- nazwa menu -->
            <tr>
                <td><label for="menu-name">Nazwa:</label></td>
                <td>
                    {{ tag.textBoxLang([
                        'name' : 'name',
                        'id'   : 'menu-name',
                        'class': 'w100p'
                    ]) }}
                </td>
                <td><p class="description">
                    Wyświetlana jest głównie na panelu bocznym w PA.
                </p></td>
            </tr>
            <!-- czy menu jest prywatne? -->
            <tr>
                <td>Szczegóły:</td>
                <td>
                    {{ tag.checkBoxLang([
                        'name' : 'private',
                        'id'   : 'menu-private',
                        'label': 'Prywatne'
                    ]) }}
                </td>
                <td><p class="description">
                    Menu nie jest dostępne do wyboru dla szablonu.
                </p></td>
            </tr>
            <!-- czy menu jest dostępne? -->
            <tr>
                <td></td>
                <td>
                    {{ tag.checkBoxLang([
                        'name' : 'online',
                        'id'   : 'menu-online',
                        'label': 'Dostępne'
                    ]) }}
                </td>
                <td><p class="description">
                    Menu nie jest widoczne w PA poza listą.
                </p></td>
            </tr>
            <tr>
                <td colspan="3">
                    <button>Dodaj menu</button>
                </td>
            </tr>
        </table>

    {{ tag.endForm() }}
</div>
