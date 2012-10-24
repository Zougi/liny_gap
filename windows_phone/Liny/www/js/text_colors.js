//globals
var colors_text, appearance_text;

/**
 * @function load the texts from i18n for the colors
 * @name init_text_colors
 */
function init_text_colors() {
        colors_text = {
                black: $.t('physique.color.black'),
                blond: $.t('physique.color.blond'),
                blue: $.t('physique.color.blue'),
                brown: $.t('physique.color.brown'),
                grey: $.t('physique.color.grey'),
                white: $.t('physique.color.white'),
                ginger: $.t('physique.color.ginger'),
                green: $.t('physique.color.green')
        };
        
        appearance_text = {
                white: $.t('physique.appearance.caucasian'),
                brown: $.t('physique.appearance.mediterranean'),
                yellow: $.t('physique.appearance.asian'),
                black: $.t('physique.appearance.african')
        }
}