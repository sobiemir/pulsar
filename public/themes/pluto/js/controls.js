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

function initializeCheckboxes()
{
	let checkboxes = $(".checkbox");
	let current    = null;

	checkboxes.click((ev) => {
		let tag   = $(ev.currentTarget);
		let input = tag.children("input");
		let span  = tag.children("span");

		input.focus();
		tag.toggleClass( "checked" );

		if( tag.hasClass("checked") )
			input[0].checked = true;
		else
			input[0].checked = false;

		ev.preventDefault();
		current = null;
	}).mousedown((ev) => {
		current = ev.currentTarget;
	});

	checkboxes.children("input").focus((ev) => {
		let checkbox = $(ev.currentTarget).parent();
		if( !checkbox.hasClass("focused") )
			checkbox.addClass("focused");
	}).blur((ev) => {
		if( current != null )
		{
			let input = $(current).children("input");
			if( input.length > 0 && input[0] == ev.currentTarget )
			{
				ev.preventDefault();
				return;
			}
		}

		let checkbox = $(ev.currentTarget).parent();
		if( checkbox.hasClass("focused") )
			checkbox.removeClass("focused");
	});
}

function initlializeTabs()
{
	let tabs = $(".tab-control");

	tabs.click((ev) => {
		let tag = $(ev.currentTarget);

		if( ev.target.tagName == "LI" )
		{
			$(tag).children("li.selected").removeClass( "selected" );
			$(ev.target).addClass( "selected" );
		}
	});
}

$(document).ready(() => {
	initializeCheckboxes();
	initlializeTabs();
});
