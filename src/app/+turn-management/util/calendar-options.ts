export class CalendarOptions {
    public static OPTIONS: any = {
        locale: 'es',
        editable: false,
        eventLimit: true,
        eventColor: 'green',
        selectable: true,
        selectOverlap: function(event: any) {
            return event.clickAllowed;
        },
        header: {
            left: 'title',
            center: '',
            right: 'today prev,next'
        //   right: 'month,agendaWeek,agendaDay,listMonth'
        },
        showNonCurrentDates: false,
        fixedWeekCount: false,
        columnFormat: 'dddd',
        buttonText: {
          today:    'Hoy',
          month:    'Mes',
          week:     'Semana',
          day:      'Día',
          list:     'Agenda'
        },
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miercoles',
        'Jueves', 'Viernes', 'Sabado'],
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
        'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        timeFormat: 'H:mm',
        events: []
    };
}