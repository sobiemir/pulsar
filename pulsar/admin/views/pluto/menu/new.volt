<div id="content" class="items-vertical lightgrey-back fill-free">

    {{ tag.form([
        'admin/menu',
        'id': 'menu-edit',
        'source': data,
        'active': language.id
    ]) }}

        <div class="head-bar white-back">
            <h2 class="mb5">Nowe menu</h2>
            <p class="description">
                Utworzone menu będzie puste, dlatego warto od razu podpiąć
                do niego strony, artykuły lub przekierowania.
            </p>
        </div>

        <table class="w100p form container">
            <!-- język dodawanego menu -->
            <tr>
                <td>Język:</td>
                <td colspan="2">
                    {{ tag.tabControl([
                        'index'   : 'default_name',
                        'bin2guid': true,
                        'source'  : languages,
                        'selected': language.id,
                        'class'   : 'language-selector'
                    ]) }}
                </td>
            </tr>
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
