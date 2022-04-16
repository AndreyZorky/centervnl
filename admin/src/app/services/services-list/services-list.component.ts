import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Service } from 'src/app/shared/interfaces';
import { ServiceService } from 'src/app/shared/transport/service.service';

const STEP = 25

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.css']
})
export class ServicesListComponent implements OnInit {

  limit = STEP
  offset = 0

  now: Date
  oSub: Subscription
  services: Service[]
  loading = false
  noMore = false
  filter: any = {
    'fields_date': 1,
    'fields_name': 1,
    'fields_description': 1,
    'fields_visible': 1,
    'fields_image': 1
  }

  constructor( private servicesService: ServiceService,
    private datePipe: DatePipe,
    private router: Router) { }

  ngOnInit(): void {
    this.now = new Date()
    this.loading = true

    this.fetch()
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })

    this.oSub = this.servicesService.fetch(params).subscribe(services => {
      this.services = services
      this.services.forEach(service => {
        if (service.date) {
          if (service.date.single && service.date.single.find(d => d > this.now)) {
            service.dateStr = "Открыта"
          }
          else if (!!service.date.period && service.date.period.find(p =>  ((new Date(p.start) <= this.now) && (!p.end || new Date(p.end) > this.now) && p.visible))) {
              service.dateStr = "Открыта"
          } else {
            service.dateStr = "Закрыта"
          }
        } else {
          service.dateStr = "Закрыта"
        }
      })
      this.noMore = services.length < this.limit
      this.loading = false
    })
  }

  createService(event) {
    this.router.navigate(['services', 'new'])
  }

  editService(id) {
    this.router.navigate(['services', id])
  }

  loadMore(toEnd: boolean) {
    if (toEnd) this.offset += this.limit
    else this.offset -= this.limit
    this.loading = true
    this.fetch()
  }

  ngOnDestroy(): void {
    if (this.oSub) this.oSub.unsubscribe()
  }

}