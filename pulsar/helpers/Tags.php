<?php
namespace Pulsar\Helper;
/*
 *  This file is part of Pulsar CMS
 *  Copyright (c) by sobiemir <sobiemir@aculo.pl>
 *     ___       __            
 *    / _ \__ __/ /__ ___ _____
 *   / ___/ // / (_-</ _ `/ __/
 *  /_/   \_,_/_/___/\_,_/_/
 *
 *  This source file is subject to the New BSD License that is bundled
 *  with this package in the file LICENSE.txt.
 *
 *  You should have received a copy of the New BSD License along with
 *  this program. If not, see <http://www.licenses.aculo.pl/>.
 */

namespace Pulsar\Helper;

use Phalcon\Mvc\Model\Resultset;

class Tags extends \Phalcon\Tag
{
	public static $_index = 1;


	public static function textBoxLang( array $params = [] ): string
	{
		$name  = $params['name'] ?? $params[0] ?? self::getNextId();
		$class = $params['class'] ?? '';

		$source = $params['source'] ?? self::$_source ?? [];
		$elemid = $params['id'] ?? $name;
		$active = $params['active'] ?? self::$_active ?? false;

		if( !(is_object($source) || is_array($source)) || empty($source) )
			return '';

		// gdy nie podano, domyślnie aktywuj pierwszy podany język
		if( !$active )
			$active = $source[0]->id_language;

		$retval = '';
		$index = 1;

		// generuj pojedyncze elementy
		foreach( $source as $elem )
		{
			$langid = Utils::BinToGUID( $elem->id_language );
			$retval .= self::textBox([
				'id'    => "{$elemid}-{$index}",
				'name'  => "{$name}-{$index}",
				'value' => $elem->{$name},
				'class' => $class . ($active != $elem->id_language
					? ' hidden'
					: ''
				),
				'data' => [
					'lang' => $langid
				]
			]);
			++$index;
		}

		return $retval;
	}

	public static function checkBoxLang( array $params = [] ): string
	{
		$name  = $params['name'] ?? $params[0] ?? self::getNextId();
		$class = $params['class'] ?? '';

		$source = $params['source'] ?? self::$_source ?? [];
		$elemid = $params['id'] ?? $name;
		$active = $params['active'] ?? self::$_active ?? false;
		$label  = $params['label'] ?? null;

		if( !(is_object($source) || is_array($source)) || empty($source) )
			return '';

		// gdy nie podano, domyślnie aktywuj pierwszy podany język
		if( !$active )
			$active = $source[0]->id_language;

		$retval = '';
		$index = 1;

		// generuj pojedyncze elementy
		foreach( $source as $elem )
		{
			$langid = Utils::BinToGUID( $elem->id_language );
			$retval .= self::checkBox([
				'id'      => "{$elemid}-{$index}",
				'name'    => "{$name}-{$index}",
				'checked' => $elem->{$name},
				'label'   => $label,
				'class'   => $class . ($active != $elem->id_language
					? ' hidden'
					: ''
				),
				'data' => [
					'lang' => $langid
				]
			]);
			++$index;
		}

		return $retval;
	}

	public static function textBox( array $params = [] ): string
	{
		$name   = $params['name'] ?? $params[0] ?? self::getNextId();
		$elemid = $params['id'] ?? $name;
		$value  = $params['value'] ?? '';
		$class  = $params['class'] ?? '';

		$retval = "<input type=\"text\" value=\"{$value}\" " .
			"id=\"{$elemid}\" name=\"{$name}\" class=\"{$class}\" ";

		// wyłączenie kontrolki
		if( isset($params['disabled']) && $params['disabled'] )
			$retval .= 'disabled="disabled" ';
		
		// uzupełnianie danych
		if( isset($params['autocomplete']) && !$params['autocomplete'] )
			$retval .= 'autocomplete="off" ';

		// kontrolka tylko do odczytu
		if( isset($params['readonly']) && $params['readonly'] )
			$retval .= 'readonly="readonly" ';

		// tekst pomocniczy
		if( isset($params['placeholder']) )
			$retval .= "placeholder=\"{$params['placeholder']}\" ";

		if( isset($params['data']) )
			foreach( $params['data'] as $key => $data )
				$retval .= " data-{$key}=\"{$data}\"";

		return $retval . '/>';
	}

	public static function checkBox( array $params = [] ): string
	{
		$name   = $params['name'] ?? $params[0] ?? self::getNextId();
		$for    = $params['for'] ?? self::getNextId();
		$elemid = $params['id'] ?? $name;
		$label  = $params['label'] ?? null;
		$class  = $params['class'] ?? '';

		// zaznacz główny kontener gdy kontrolka jest zaznaczona
		if( isset($params['checked']) )
			$class = "checked {$class}";

		$retval = "<div id=\"{$elemid}\" " .
			"class=\"checkbox items-horizontal {$class}\" ";

		// dodatkowe dane
		if( isset($params['data']) )
			foreach( $params['data'] as $key => $data )
				$retval .= " data-{$key}=\"{$data}\"";

		$retval .= "><input id=\"{$for}\" type=\"checkbox\" name=\"{$name}\" ";

		// czy kontrolka ma być zaznaczona?
		if( isset($params['checked']) )
			$retval .= 'checked="checked" ';

		// wyłączenie kontrolki
		if( isset($params['disabled']) )
			$retval .= 'disabled="disabled" ';

		if( isset($params['readonly']) )
			$retval .= 'readonly="readonly" ';

		$retval .= '/><span></span>';

		// napis obok kontrolki
		if( $label )
			$retval .= "<label for=\"{$for}\">{$label}</label>";

		return $retval . '</div>';
	}

	public static function tabControl( array $params = [] ): string
	{
		$elemid = $params['id'] ?? $params[0] ?? self::getNextId();
		$source = $params['source'] ?? self::$_source[$elemid] ?? null;

		// ta kontrolka musi się powoływać na jakieś źródło...
		if( !is_array($source) && !is_object($source) )
			return '';

		// nazwa klasy i zaznaczony element
		$class    = $params['class'] ?? '';
		$selected = $params['selected'] ?? false;

		// kontener dla listy
		$retval = "<ul id=\"{$elemid}\"" .
			"class=\"tab-control items-horizontal {$class}\">";

		// wyświetlane pole i element wyłączony z użytku
		$index    = $params['index'] ?? 'name';
		$disabled = $params['disabled'] ?? false;
		$bin2guid = $params['bin2guid'] ?? false;

		// wypełnij listę elementami
		foreach( $source as $value )
		{
			// konwertuj ID z postaci binarnej na GUID
			$retval .= $bin2guid
				? '<li data-id="' . Utils::BinToGUID( $value->id ) . '"'
				: '<li data-id="' . $value->id . '"';

			// elementy mogą być wyłączone z użytku
			if( $disabled && $value->{$disabled} )
				$retval .= ' class="disabled"';
			// ale zaznaczony element może być tylko jeden
			else if( $selected && $selected == $value->id )
				$retval .= ' class="selected"';

			$retval .= ">{$value->{$index}}</li>";
		}
		// zwiększ indeks numeru kontrolki
		self::$_index++;

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
	private static $_source = null;

	private static $_active = null;

	/**
	 * Tworzenie formularza dla kontrolek.
	 * Dodany został nowy parametr do ułatwienia zarządzania kontrolkami.
	 * 
	 * > source: Źródło pobierania danych do kontrolek (tablica z wartościami którymi mają zostać uzupełnione).
	 *           Wartości ustawiane są dla kontrolek względem ustawionej nazwy (name).
	 * 
	 * @param  array|string $params Tablica parametrów przekazywanych do funkcji.
	 * @return string                   Zwraca tag początkowy formularza.
	 */
	public static function form( $parms ): string
	{
		$parms = is_array( $parms )
			? $parms
			: [ $parms ];

		self::$_namespace = $parms['id']     ?? $parms[0];
		self::$_source    = $parms['source'] ?? null;
		self::$_active    = $parms['active'] ?? null;

		unset( $parms['source'] );

		$retval = parent::form( $parms );

		// ukryta kontrolka z nazwą formularza
		$retval .= parent::hiddenField([
			'form',
			'id'    => null,
			'value' => $parms['id']
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

	/**
	 * Generuje identyfikator dla kontrolki.
	 *
	 * RETURNS:
	 *     Wygenerowany identyfikator.
	 */
	private static function getNextId(): string
	{
		return 'pagv-' . self::$_index++;
	}
}
