<?php
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

namespace Pulsar\Helper;

class Tags extends \Phalcon\Tag
{
	public static function TabControl( array $source, array $parameters = [] ): string
	{
		// jeżeli źródło jest puste to nie ma co wyświetlać
		if( empty($source) )
			return '';

		// pierwszy argument robi za identyfikator gdy nie został on podany
		if( !isset($parameters['id']) )
			$parameters['id'] = $parameters[0];

		// klasa przekazywana do listy
		$parameters['class'] = isset($parameters['class'])
			? ' ' . $parameters['class']
			: '';
		if( !isset($parameters['selected']) )
			$parameters['selected'] = key( $source );

		$retval = '<ul id="' . $parameters['id'] . '" class="tab-control items-horizontal' .
			$parameters['class'] . '">';

		// indeks, domyślnie __display__
		$index = $parameters['index'] ?? '__display__';

		// wypełnij listę wartościami
		foreach( $source as $value )
			if( $parameters['selected'] == $value['id'] )
				$retval .= '<li data-id="' . $value['id'] . '" class="selected">' . $value[$index] . '</li>';
			else
				$retval .= '<li data-id="' . $value['id'] . '">' . $value[$index] . '</li>';

		return $retval . '</ul>';
	}

	public static function stylesheetLink( $parameters = NULL, $local = NULL )
	{
		if( $local === NULL )
			return parent::stylesheetLink( '/themes/pluto/' . $parameters . '.css', $local );

		return parent::stylesheetLink( $parameters, $local );
	}

	public static function javascriptInclude( $parameters = NULL, $local = NULL )
	{
		$url = '/themes/pluto/';

		if( !is_array($parameters) )
			$parameters = [$parameters];

		// parametr src
		if( !isset($parameters[0]) )
		{
			$parameters[0] = $parameters["src"];
			unset( $parameters['src'] );
		}

		// specjalny atrybut data-main (dla requirejs - może nie jest potrzebne?)
		if( isset($parameters['data-main']) )
			$parameters['data-main'] = $url . $parameters['data-main'];

		// ładowanie z sieci lub serwera na którym stoi strona
		if( $local === false )
			$url = $parameters[0];
		else
			$url .= $parameters[0] . '.js';

		// twórz znacznik
		$code = '<script src="' . $url . '" ';

		foreach ($parameters as $key => $attributeValue) {
			if( !is_integer($key) )
				$code .= $key . '="' . $attributeValue . '" ';
		}
		$code.= '></script>';

		return $code;
	}

	public static function image( $parameters = NULL, $local = NULL )
	{
		$url = '/themes/pluto/img/';

		if( !is_array($parameters) )
			$parameters = [$parameters];

		// parametr src
		if( !isset($parameters[0]) )
		{
			$parameters[0] = $parameters["src"];
			unset( $parameters['src'] );
		}

		// ładowanie z sieci lub serwera na którym stoi strona
		if( $local === false )
			$url = $parameters[0];
		else
			$url .= $parameters[0];

		// twórz znacznik
		$code = '<img src="' . $url . '" ';

		foreach ($parameters as $key => $attributeValue) {
			if( !is_integer($key) )
				$code .= $key . '="' . $attributeValue . '" ';
		}
		$code.= ' />';

		return $code;
	}

	public static function directUrl()
	{
		return '';
	}

	public static function logo( int $size = 64, string $color1 = "#4a4a4a", string $color2 = "#c83737" )
	{
		$scale = $size / 64;
		return '<svg width="' . $size . '" height="' . $size . '"><g transform="scale(' . $scale . ')">
			<path fill="' . $color1 . '"
			   d="m 32,-1.3e-5 c -17.673124,-8e-12 -32.000016568553,14.326906 -32,32.00003 0,17.673112 14.326888,32 32,32 17.673112,0 32,-14.326888 32,-32 C 64.000017,14.326893 49.673124,-1.3000008e-5 32,-1.3e-5 Z m 0,6 c 14.359415,0 26.000017,11.640615 26,26.00003 -0.117112,14.46527 -11.837624,25.595416 -26,26 -14.359403,0 -26,-11.640597 -26,-26 C 6.1172531,17.534909 17.837554,6.4044259 32,5.999987 Z" />
			<path fill="' . $color1 . '" d="m32,17.999117a14,14 0 0 1 14,14l6,0a20,20 0 0 0 -20,-20l0,6z" />
			<path fill="' . $color1 . '" d="m12,31.999117a20,20 0 0 0 20,20l0,-6a14,14 0 0 1 -14,-14l-6,0z" />
			<circle fill="' . $color2 . '" r="8" cy="32.000017" cx="31.999998" />
		</g></svg>';
	}

	/**
	 * Przestrzeń nazw dla kontrolek z której generowane jest ID.
	 * @var string
	 */
	private static $_namespace = '';
	/**
	 * Źródło danych z którego pobierane są wartości kontrolek formularza.
	 * @var array
	 */
	private static $_source = [];

	/**
	 * Tworzenie formularza dla kontrolek.
	 * Dodany został nowy parametr do ułatwienia zarządzania kontrolkami.
	 * 
	 * > source: Źródło pobierania danych do kontrolek (tablica z wartościami którymi mają zostać uzupełnione).
	 *           Wartości ustawiane są dla kontrolek względem ustawionej nazwy (name).
	 * 
	 * @param  array|string $parameters Tablica parametrów przekazywanych do funkcji.
	 * @return string                   Zwraca tag początkowy formularza.
	 */
	public static function form( $parameters ): string
	{
		$parameters = is_array( $parameters )
			? $parameters
			: [ $parameters ];

		self::$_namespace = $parameters['id']     ?? $parameters[0];
		self::$_source    = $parameters['source'] ?? [];

		unset( $parameters['source'] );

		$retval = parent::form( $parameters );

		// ukryta kontrolka z nazwą formularza
		$retval .= parent::hiddenField([
			'form',
			'id'    => null,
			'value' => $parameters['id']
		]);

		return $retval;
	}

	/**
	 * Resetowanie przestrzeni nazw i źródła danych dla kontrolek.
	 * Zamykanie elementu formularza.
	 * 
	 * @return string Tag końcowy formularza.
	 */
	public static function endForm(): string
	{
		self::$_namespace = '';
		self::$_source    = [];

		return parent::endForm();
	}

	public static function checkField( $parameters ): string
	{
		$parameters = is_array( $parameters )
			? $parameters
			: [ $parameters ];

		// nazwa i identyfikator
		$parameters['name'] = $parameters['name'] ?? $parameters[0];
		$parameters['id']   = $parameters['id']   ?? self::$_namespace . '-' . $parameters['name'];

		// kontrolki i źródło danych
		$tag   = $parameters['tag']   ?? [ 'name' => 'div' ];
		$label = $parameters['label'] ?? false;

		// kontrolka opakowująca
		$tag = is_array( $tag )
			? $tag
			: [ $tag ];

		$tag['name']  = $tag['name']  ?? $tag[0];        
		$tag['class'] = $tag['class'] ?? 'checkbox items-horizontal';

		// etykieta
		if( $label )
		{
			$label = is_array( $label )
				? $label
				: [ $label ];
			$label['name'] = $label['name'] ?? $label[0];
			$label['for']  = $parameters['id'];
		}

		unset( $parameters[0] );
		unset( $parameters['tag'] );
		unset( $parameters['label'] );
		unset( $tag[0] );
		unset( $label[0] );

		// pobierz wartość kontrolki ze źródła danych
		if( isset(self::$_source[$parameters['name']]) )
		{
			$source = self::$_source[$parameters['name']];

			// wiele wartości - element wielojęzyczny
			if( is_array($source) )
			{
				// każdy element zawiera następującą strukturę: język => wartość
				// TODO
			}
			else if( $source == true )
			{
				$parameters['checked'] = 'checked';
				$tag['class'] .= ' checked';
			}
		}

		// kontrolka zaznaczania
		$retval = '<input type="checkbox"';
		foreach( $parameters as $key => $value )
			$retval .= ' ' . $key . '="' . $value . '"';
		$retval .= ' /><span></span>';

		// etykieta
		if( $label )
			$retval .= Tags::label( $label );

		// całość
		return Tags::surroundingTag( $tag, $retval );
	}

	private static function surroundingTag( array $parameters, string $html ): string
	{
		$tag = $parameters['name'];
		unset( $parameters['name'] );

		$retval = '<' . $tag;
		foreach( $parameters as $key => $value )
			$retval .= ' ' . $key . '="' . $value . '"';
		$retval .= '>' . $html . '</' . $tag . '>';

		return $retval;
	}

	private static function label( array $parameters ): string
	{
		$html = $parameters['name'];
		unset( $parameters['name'] );

		$retval = '<label ';
		foreach( $parameters as $key => $value ) 
			$retval .= ' ' . $key . '="' . $value . '"';
		$retval .= '>' . $html . '</label>';

		return $retval;
	}
}
