<?php
namespace Pulsar\Model;
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

use Phalcon\Mvc\Model\Resultset;
use Pulsar\Helper\Utils;

class Language extends \Phalcon\Mvc\Model
{
    /**
     *
     * @var string
     * @Primary
     * @Column(type="string", length=16, nullable=false)
     */
    public $id;

    /**
     *
     * @var integer
     * @Column(type="integer", length=1, nullable=false)
     */
    public $frontend;

    /**
     *
     * @var integer
     * @Column(type="integer", length=1, nullable=false)
     */
    public $backend;

    /**
     *
     * @var integer
     * @Column(type="integer", length=1, nullable=false)
     */
    public $direction;

    /**
     *
     * @var integer
     * @Column(type="integer", length=11, nullable=false)
     */
    public $order;

    /**
     *
     * @var string
     * @Column(type="string", length=20, nullable=false)
     */
    public $code;

    /**
     *
     * @var string
     * @Column(type="string", length=100, nullable=false)
     */
    public $default_name;

    /**
     * Lista języków utworzonych systemie.
     */
    protected static $_all_langs = [];

    /**
     * Aktualnie używany przez użytkownika język.
     */
    protected static $_curr_lang = null;

    /**
     * Lista języków dostępnych na stronie.
     */
    protected static $_front_langs = [];

    /**
     * Lista języków dostępnych dla panelu administratora.
     */
    protected static $_back_langs = [];


    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->hasMany(
            'id',
            '\Pulsar\Model\Menu',
            'id_language'
        );
    }

    /**
     * Returns table name mapped in the model.
     *
     * @return string
     */
    public function getSource()
    {
        return 'language';
    }


    private $_id = null;
    private $_id_language = null;

    public function getRawId(): string
    {
        return $this->id;
    }

    public function getId(): string
    {
        if( !$this->_id )
            $this->_id = Utils::BinToGUID( $this->id );
        return $this->_id;
    }

    public function isDisabled(): bool
    {
        return !$this->frontend && !$this->backend;
    }

    /**
     * Allows to query a set of records that match the specified conditions
     *
     * @param mixed $parameters
     * @return Language[]
     */
    public static function find( $parameters = null )
    {
        return parent::find( $parameters );
    }

    /**
     * Allows to query the first record that match the specified conditions
     *
     * @param mixed $parameters
     * @return Language
     */
    public static function findFirst( $parameters = null )
    {
        return parent::findFirst( $parameters );
    }

    public static function setLanguage( string $id ): void
    {
        if( empty(Language::$_curr_lang) )
        {
            Language::findAndStore( $id );
            return;
        }

        if( Language::$_curr_lang->id != $id )
        {
            Language::$_curr_lang = reset( Language::$_all_langs );

            foreach( Language::$all_langs as $lang )
                if( $lang->id == $id )
                    Language::$_curr_lang = $lang;
        }
    }

    public static function getAll(): array
    {
        if( empty(Language::$_all_langs) )
            Language::findAndStore( null );

        return Language::$_all_langs;
    }

    public static function getCurrent(): Language
    {
        if( empty(Language::$_curr_lang) )
        {
            if( empty(Language::$_all_langs) )
                Language::findAndStore( null );

            Language::$_curr_lang = current( Language::$_all_langs );
        }
        return Language::$_curr_lang;
    }

    public static function getFrontend(): array
    {
        if( empty(Language::$_front_langs) )
            Language::findAndStore( null );

        return Language::$_front_langs;
    }

    public static function getBackend(): array
    {
        if( empty(Language::$_back_langs) )
            Language::findAndStore( null );

        return Language::$_back_langs;
    }

    private static function findAndStore( $id ): void
    {
        // pobierz języki z bazy danych
        $langs = Language::find([
            'order' => '[order]'
        ]);

        if( count($langs) == 0 )
            throw new \Exception( "No language available in database!" );

        // uzupełnij tablice w oparciu o pobrane języki
        foreach( $langs as $lang )
        {
            if( $lang->id == $id )
                Language::$_curr_lang = $lang;

            if( $lang->frontend )
                Language::$_front_langs[] = $lang;

            if( $lang->backend )
                Language::$_back_langs[] = $lang;
        }
        Language::$_all_langs = $langs;
    }
}
