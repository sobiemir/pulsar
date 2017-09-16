<div id="content" class="items-vertical lightgrey-back fill-free">
    <form id="side-edit" class="" method="post" action="/admin/menu">
        <div class="head-bar simple">
            <h2>Nowe menu</h2>
            <p class="description mb12">Tworzy nowe menu, tararara, tararara, tararara, tararara.</p>
            <table class="w100p form">
                <tr>
                    <td>Język:</td>
                    <td colspan="2">
                        <ul class="tab-control items-horizontal">
                            <li class="selected">Polski</li>
                            <li>English</li>
                            <li>Русский</li>
                            <li>Deutsch</li>
                        </ul>
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
        </div>
    <!--        <section class="items-vertical">
                <footer class="items-horizontal button-box w100p">
                    <div class="items-horizontal fill-free">
                        <button type="submit"><i class="fa fa-floppy-o"></i>Zapisz</button>
                    </div>
                </footer>
            </section> -->
    </form>
</div>
