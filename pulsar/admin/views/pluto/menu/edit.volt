<div class="items-vertical lightgrey-back fill-free">

    <!-- formularz edycji -->
    {{ tag.form([
        'admin/menu/edit/' ~ data[0].getId(),
        'id': 'i01ME-form',
        'source': data
    ]) }}

        <div class="head-bar mb00">
            <h2 class="mb5">Edycja menu</h2>
            <p class="description">
                <span class="blue">GUID:</span> {{data[0].getId()}}
            </p>
        </div>

        {{ tag.tabControl([
            'index'   : 'default_name',
            'source'  : languages,
            'selected': language,
            'class'   : 'white-back head-bar',
            'data'    : [
                'searcher': '#i01ME-container',
                'remover':  '#i01ME-remove-lang',
                'creator':  '#i01ME-add-lang'
            ]
        ]) }}

        <table id="i01ME-container" class="w100p form container">
            <!-- nazwa menu -->
            <tr>
                <td><label for="menu-name">Nazwa:</label></td>
                <td>
                    {{ tag.textBoxLang([
                        'name' : 'name',
                        'id'   : 'i01ME-name',
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
                        'id'   : 'i01ME-private',
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
                        'id'   : 'i01ME-online',
                        'label': 'Dostępne'
                    ]) }}
                </td>
                <td><p class="description">
                    Menu nie jest widoczne w PA poza listą.
                </p></td>
            </tr>
        </table>
        <div class="button-container">
            <button class="blue">Zapisz zmiany</button>
            <button id="i01ME-add-lang" type="button" class="ml-a green">
                Dodaj język
            </button>
            <button id="i01ME-remove-lang" type="button" class="black">
                Usuń język
            </button>
            <button id="i01ME-remove" type="button" class="red">
                Usuń menu
            </button>
        </div>
    {{ tag.endForm() }}
</div>
