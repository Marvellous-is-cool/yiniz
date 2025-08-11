<?php
/**
 * phpMyAdmin Configuration for Aiven MySQL
 * Custom configuration to connect to your Aiven cloud database
 */

declare(strict_types=1);

/**
 * Start session configuration
 */
if (!session_id()) {
    ini_set('session.cache_limiter', 'nocache');
    ini_set('session.cookie_httponly', '1');
    session_start();
}

/**
 * This is needed for cookie based authentication to encrypt password in cookie.
 */
$cfg['blowfish_secret'] = 'yiniz-secure-32char-blowfish-key';

/**
 * Server configuration - Aiven MySQL
 */
$i = 0;

/**
 * First server - Your Aiven MySQL Database
 */
$i++;
$cfg['Servers'][$i]['host'] = 'mysql-347c509b-bashvote.h.aivencloud.com';
$cfg['Servers'][$i]['port'] = 27723;
$cfg['Servers'][$i]['socket'] = '';
$cfg['Servers'][$i]['ssl'] = true;
$cfg['Servers'][$i]['ssl_verify'] = false;
$cfg['Servers'][$i]['connect_type'] = 'tcp';
$cfg['Servers'][$i]['extension'] = 'mysqli';
$cfg['Servers'][$i]['auth_type'] = 'cookie';
$cfg['Servers'][$i]['user'] = 'avnadmin';
$cfg['Servers'][$i]['password'] = '';  // Leave empty for security - will prompt for password
$cfg['Servers'][$i]['AllowNoPassword'] = false;

/**
 * Additional server options
 */
$cfg['Servers'][$i]['verbose'] = 'Aiven MySQL (Yiniz Database)';
$cfg['Servers'][$i]['pmadb'] = '';
$cfg['Servers'][$i]['bookmarktable'] = '';
$cfg['Servers'][$i]['relation'] = '';
$cfg['Servers'][$i]['table_info'] = '';
$cfg['Servers'][$i]['table_coords'] = '';
$cfg['Servers'][$i]['pdf_pages'] = '';
$cfg['Servers'][$i]['column_info'] = '';
$cfg['Servers'][$i]['history'] = '';
$cfg['Servers'][$i]['table_uiprefs'] = '';
$cfg['Servers'][$i]['tracking'] = '';
$cfg['Servers'][$i]['userconfig'] = '';
$cfg['Servers'][$i]['recent'] = '';
$cfg['Servers'][$i]['favorite'] = '';
$cfg['Servers'][$i]['users'] = '';
$cfg['Servers'][$i]['usergroups'] = '';
$cfg['Servers'][$i]['navigationhiding'] = '';
$cfg['Servers'][$i]['savedsearches'] = '';
$cfg['Servers'][$i]['central_columns'] = '';
$cfg['Servers'][$i]['designer_settings'] = '';
$cfg['Servers'][$i]['export_templates'] = '';

/**
 * Optional: Add your local MySQL server as well
 */
$i++;
$cfg['Servers'][$i]['host'] = 'localhost';
$cfg['Servers'][$i]['port'] = 3306;
$cfg['Servers'][$i]['socket'] = '';
$cfg['Servers'][$i]['connect_type'] = 'tcp';
$cfg['Servers'][$i]['extension'] = 'mysqli';
$cfg['Servers'][$i]['auth_type'] = 'cookie';
$cfg['Servers'][$i]['user'] = 'root';
$cfg['Servers'][$i]['password'] = '';
$cfg['Servers'][$i]['AllowNoPassword'] = true;
$cfg['Servers'][$i]['verbose'] = 'Local MySQL (Development)';

/**
 * Directories for saving/loading files from server
 */
$cfg['UploadDir'] = '';
$cfg['SaveDir'] = '';

/**
 * Whether to display icons or text or both icons and text in table row action segment
 */
$cfg['RowActionType'] = 'both';

/**
 * Defines whether a user should be displayed a "show all (records)" button
 */
$cfg['ShowAll'] = false;

/**
 * Number of rows displayed when browsing a result set
 */
$cfg['MaxRows'] = 25;

/**
 * Disallow editing of binary fields
 */
$cfg['ProtectBinary'] = false;

/**
 * Default language to use, if not browser-defined or user-defined
 */
$cfg['DefaultLang'] = 'en';

/**
 * How many columns should be used for table display of a database?
 */
$cfg['PropertiesNumColumns'] = 1;

/**
 * Set to true if you want DB-based query history.If false, this utilizes JS-routines to display query history
 */
$cfg['QueryHistoryDB'] = false;

/**
 * When using DB-based query history, how many entries should be kept?
 */
$cfg['QueryHistoryMax'] = 25;

/**
 * Whether or not to query the user before sending the error report.
 */
$cfg['SendErrorReports'] = 'ask';

/**
 * 'URLQueryEncryption' defines whether phpMyAdmin will encrypt sensitive data from the URL query string.
 */
$cfg['URLQueryEncryption'] = false;
?>
