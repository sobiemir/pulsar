<div id="content" class="items-vertical lightgrey-back fill-free">

    <!-- formularz edycji -->
    {{ tag.form(['admin/menu', 'id': 'menu-form', 'source': data]) }}

        <div class="head-bar simple">
            <h2>Edycja menu</h2>
            <p class="mb12"><span class="grey">ID:</span> {{bin2guid(data.id)}}</p>

            <table class="w100p form">
                <!-- wybór języka dla edytowanej treści -->

            </table>
        </div>
    <!--        <section class="items-vertical">
                <footer class="items-horizontal button-box w100p">
                    <div class="items-horizontal fill-free">
                        <button type="submit"><i class="fa fa-floppy-o"></i>Zapisz</button>
                    </div>
                </footer>
            </section> -->
    {{ tag.endForm() }}
</div>
