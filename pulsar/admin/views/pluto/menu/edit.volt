<div id="content" class="items-vertical lightgrey-back fill-free">

    <!-- formularz edycji -->
    {{ tag.form([
        'admin/menu',
        'id': 'menu-form'
    ]) }}

        <div class="head-bar white-back">
            <h2 class="mb5">Edycja menu</h2>
            <p class="description"><span class="purple">GUID:</span> {{bin2guid(data.id)}}</p>

            <table class="w100p form">
                <!-- wybór języka dla edytowanej treści -->

            </table>
        </div>

        <table class="w100p form container">
            <tr>
                <td>Język:</td>
                <td colspan="2">
                    {{ tag.tabControl([
                        'index'   : 'default_name',
                        'source'  : languages,
                        'bin2guid': true
                    ]) }}
                </td>
            </tr>
            <tr>
                <td><label for="menu-name">Nazwa:</label></td>
                <td><input id="menu-name" class="w100p" type="text" name="name-pl" /></td>
                <td><p class="description">Wyświetlana jest głównie na panelu bocznym w PA.</p></td>
            </tr>
            <tr>
                <td>Szczegóły:</td>
                <td>{{ tag.checkField([ 'private-menu',  'label': 'Prywatne menu' ]) }}</td>
                <td><p class="description">Menu nie jest dostępne do wyboru dla szablonu.</p></td>
            </tr>
            <tr>
                <td></td>
                <td>{{ tag.checkField([ 'hide-menu',  'label': 'Ukryj menu' ]) }}</td>
                <td><p class="description">Menu nie jest widoczne w PA poza listą.</p></td>
            </tr>
            <tr>
                <td colspan="3">
                    <button>Dodaj menu</button>
                </td>
            </tr>
        </table>

    {{ tag.endForm() }}
</div>
