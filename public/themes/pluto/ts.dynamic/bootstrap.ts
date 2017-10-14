/*
 *  This file is part of Pulsar CMS
 *  Copyright (c) by sobiemir <sobiemir@aculo.pl>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {MainView} from "./view/MainView";

export default class Bootstrap
{
    private html: string = "index/index.html";
    private page: string = "index";
    private view: string = "index";

    constructor() {}

    public setStartPage( page: string, view: string ): void
    {
        this.html = "../html/" + page + "/" + view + ".html";
        this.page = page;
        this.view = view;
    }

    public start(): void
    {
        require( ["text!" + this.html], (html) =>
        {
            if( window.hasOwnProperty("increaseLoadingProgress") )
                window["increaseLoadingProgress"].call();

            // informuj o tym co załadowano
            console.log( "Załadowano widok: " + this.html );

            new MainView( html, {el: "main"} );
        } );
    }
}
